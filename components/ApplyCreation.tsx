import React, { useState } from "react";
import styled from "styled-components";
import sanitizeHtml from "sanitize-html";
import { useRouter } from "next/router";

import { Form, Input, Radio, Select, Button, Col, Row } from "antd";

import Editor from "./Editor";
import firebase from "../firebase";

const { Option } = Select;

const Question = styled.div`
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-weight: bold;
`;

const SendButton = styled(Button)`
  margin-top: 1rem;
`;

const rules = [
  { required: true, message: "Veuillez entrer une réponse !" },
  () => ({
    validator(_, value) {
      if (
        !value ||
        value.level.content === '<p><br data-mce-bogus="1"></p>' ||
        value.level.content === "<p><br></p>" ||
        value.level.content === ""
      ) {
        return Promise.reject();
      }
      return Promise.resolve();
    },
  }),
];

const serverSelector = (
  <Form.Item name="server" noStyle>
    <Select defaultValue="Vol'jin" style={{ minWidth: "10rem" }}>
      <Option value="Voljin">Vol'jin</Option>
      <Option value="Chantséternels">Chants Éternels</Option>
      <Option value="Autre">Autre</Option>
    </Select>
  </Form.Item>
);

const validateValues = (values) => {
  const {
    character,
    charpres,
    guilds,
    guildsname,
    mic,
    motiv,
    otherguilds,
    playing,
    pres,
    server,
    started,
  } = values;

  if (!server || server === "") return false;
  if (!character || character === "") return false;
  if (server === "Autre" && !character.includes("-")) return false;
  if (
    !charpres ||
    charpres.level.content === '<p><br data-mce-bogus="1"></p>' ||
    charpres.level.content === "<p><br></p>" ||
    charpres.level.content === ""
  )
    return false;
  if (
    !pres ||
    pres.level.content === '<p><br data-mce-bogus="1"></p>' ||
    pres.level.content === "<p><br></p>" ||
    pres.level.content === ""
  )
    return false;
  if (
    !motiv ||
    motiv.level.content === '<p><br data-mce-bogus="1"></p>' ||
    motiv.level.content === "<p><br></p>" ||
    motiv.level.content === ""
  )
    return false;
  if (!playing || playing === "") return false;
  if (
    !guilds ||
    guilds.level.content === '<p><br data-mce-bogus="1"></p>' ||
    guilds.level.content === "<p><br></p>" ||
    guilds.level.content === ""
  )
    return false;
  if (otherguilds === "yes" && (!guildsname || guildsname === "")) return false;
  if (!mic || mic === "") return false;
  if (!otherguilds || otherguilds === "") return false;
  if (!started || started === "") return false;

  return true;
};

const ApplyCreation = ({ user, edit, apply, author }) => {
  const router = useRouter();
  const [form] = Form.useForm();

  const [showGuilds, setShowGuilds] = useState(edit ? apply[6] === "Oui" : false);

  const defaultValues = edit
    ? {
        server: apply[0].split("-", 2)[1],
        character: apply[0].split("-", 2)[0],
        started: apply[1],
        otherguilds: apply[6],
        guildsname: apply[7],
        mic: apply[8],
        playing: apply[9],
      }
    : {
        server: "Voljin",
      };

  const sendApply = async (values, user) => {
    if (!validateValues(values)) return;

    const nameRealm =
      values.server === "Autre" ? values.character : values.character + "-" + values.server;

    const content = [
      nameRealm,
      values.started,
      sanitizeHtml(values.motiv.level.content),
      sanitizeHtml(values.guilds.level.content),
      sanitizeHtml(values.pres.level.content),
      sanitizeHtml(values.charpres.level.content),
      values.otherguilds,
      values.guildsname || "none",
      values.mic,
      values.playing,
    ];

    if (edit) {
      const applyData = {
        content,
        editDate: new Date(),
      };

      const id = router.query.id;
      await firebase.firestore().collection("applies").doc(id.toString()).update(applyData);
      await fetch("/api/statusNotification", {
        method: "POST",
        body: JSON.stringify({
          user: user.pseudo,
          name: author,
          state: "edit",
        }),
      });

      router.push(`/apply/${id.toString()}`);
    } else {
      const applyData = {
        author_id: user.uid,
        content,
        date: new Date(),
        state: "pending",
      };

      const newApply = await firebase.firestore().collection("applies").add(applyData);

      await fetch("/api/applyNotification", {
        method: "POST",
        body: JSON.stringify({ name: user.pseudo, id: newApply.id }),
      });
      router.push(`/apply/${newApply.id}`);
    }
  };

  return (
    <Form form={form} onFinish={(values) => sendApply(values, user)} initialValues={defaultValues}>
      <Form.Item
        name="character"
        label="Personnage"
        help='Si autre, mettre le pseudo sous la forme "pseudo-serveur"'
        hasFeedback
        rules={[{ required: true, message: "Veuillez entrer le nom de votre personnage !" }]}
      >
        <Input addonBefore={serverSelector} />
      </Form.Item>
      <Question>Depuis combien de temps jouez vous ?</Question>
      <Form.Item
        name="started"
        labelCol={{ span: 24 }}
        hasFeedback
        rules={[{ required: true, message: "Veuillez entrer une réponse !" }]}
      >
        <Input />
      </Form.Item>
      <Question>Pourquoi vouloir nous rejoindre ?</Question>
      <Form.Item
        name="motiv"
        hasFeedback
        rules={rules}
        getValueProps={(value: any) => value?.level?.content}
      >
        <Editor
          textareaName="motiv"
          onInit={(evt, editor) => {
            if (edit) {
              setTimeout(() => {
                editor.setContent(apply[2]);
              }, 150);
            }
          }}
        />
      </Form.Item>
      <Question>Vos anciennes guildes</Question>
      <Form.Item
        name="guilds"
        hasFeedback
        rules={rules}
        getValueProps={(value: any) => value?.level?.content}
        help="Indiquez dans quelles guildes vous avez été membre et les raisons de votre départ."
      >
        <Editor
          textareaName="guilds"
          onInit={(evt, editor) => {
            if (edit) {
              setTimeout(() => {
                editor.setContent(apply[3]);
              }, 150);
            }
          }}
        />
      </Form.Item>
      <Question>Présentez-vous IRL</Question>
      <Form.Item
        name="pres"
        getValueProps={(value: any) => value?.level?.content}
        hasFeedback
        help="Décrivez brièvement qui vous êtes qu'on apprenne à se connaître"
        rules={rules}
      >
        <Editor
          textareaName="pres"
          onInit={(evt, editor) => {
            if (edit) {
              setTimeout(() => {
                editor.setContent(apply[4]);
              }, 150);
            }
          }}
        />
      </Form.Item>
      <Question>Présentez votre personnage</Question>
      <Form.Item
        name="charpres"
        getValueProps={(value: any) => value?.level?.content}
        hasFeedback
        help="Décrivez votre personnage (race, classe, spéc(s), ilvl, expérience en donjons et raids) et
        vos objectifs pour le faire progresser."
        rules={rules}
      >
        <Editor
          textareaName="charpres"
          onInit={(evt, editor) => {
            if (edit) {
              setTimeout(() => {
                editor.setContent(apply[5]);
              }, 150);
            }
          }}
        />
      </Form.Item>
      <Question>Avez-vous des personnages dans d'autres guildes ?</Question>
      <Form.Item
        name="otherguilds"
        hasFeedback
        rules={[{ required: true, message: "Veuillez entrer une réponse !" }]}
      >
        <Radio.Group onChange={(event: any) => setShowGuilds(event.target.value === "Oui")}>
          <Radio value="Oui">Oui</Radio>
          <Radio value="Non">Non</Radio>
        </Radio.Group>
      </Form.Item>
      {showGuilds && (
        <>
          <Question>Indiquez le nom des guildes</Question>
          <Form.Item
            name="guildsname"
            labelCol={{ span: 24 }}
            hasFeedback
            rules={[{ required: true, message: "Veuillez entrer une réponse !" }]}
          >
            <Input />
          </Form.Item>
        </>
      )}
      <Question>Avez-vous un micro ?</Question>
      <Form.Item
        name="mic"
        hasFeedback
        rules={[{ required: true, message: "Veuillez entrer une réponse !" }]}
      >
        <Radio.Group>
          <Radio value="Oui">Oui</Radio>
          <Radio value="Non">Non</Radio>
        </Radio.Group>
      </Form.Item>
      <Question>Combien d'heures jouez-vous par semaine ?</Question>
      <Form.Item
        name="playing"
        labelCol={{ span: 24 }}
        hasFeedback
        rules={[{ required: true, message: "Veuillez entrer une réponse !" }]}
      >
        <Input />
      </Form.Item>
      <Row gutter={8}>
        <Col>
          <SendButton type="primary" htmlType="submit">
            Envoyer
          </SendButton>
        </Col>
        {edit && (
          <Col>
            <SendButton
              type="primary"
              danger
              onClick={() => {
                router.push(`/apply/${router.query.id}`);
              }}
            >
              Annuler
            </SendButton>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default ApplyCreation;
