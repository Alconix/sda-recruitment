import React, { useState } from "react";
import sanitizeHtml from "sanitize-html";
import ReactHtmlParser from "react-html-parser";
import styled from "styled-components";

import {
  Button,
  Col,
  Row,
  Progress,
  notification,
  Typography,
  Divider,
  Statistic,
  Select,
  Empty,
  Modal,
  message,
} from "antd";

import { EditOutlined, DeleteOutlined } from "../utils/icons";
import CommentSection from "./CommentSection";
import CommentCreator from "./CommentCreator";
import { timestampToString } from "../utils/time";
import { useRouter } from "next/router";
import { canEdit, canModerate, canVote } from "../utils/permissions";
import firebase from "../firebase";

const db = firebase.firestore();

const { Option } = Select;

interface ApplyProps {
  data: any;
  user: any;
  rio: any;
}

const DateContent = styled.div`
  p {
    margin-block-start: 0;
    margin-block-end: 0;
    color: gray;
  }

  margin-bottom: 1.5rem;
`;

const Content = styled.div`
  margin-bottom: 4rem;
`;

const SectionRow = styled(Row)`
  margin-top: 4rem;
`;

const ScoreRow = styled(Row)`
  margin-top: 4rem;
  margin-bottom: 2rem;
`;

const ApplyContent = ({ data, user, rio }: ApplyProps) => {
  const [comments, setComments] = useState(data.comments);
  const [votes, setVotes] = useState(data.votes);
  const [showModal, setShowModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [score, setScore] = useState(
    data.votes.reduce((acc, val) => acc + (val.value === 1 ? 1 : 0), 0)
  );

  const router = useRouter();

  const creationDate = timestampToString(data.date);
  const editDate = data.editDate == null ? null : timestampToString(data.editDate);

  const name = data.content[0].split("-", 2)[0];
  const realm = data.content[0].split("-", 2)[1].replace(" ", "-").replace("'", "");
  const formattedRealm =
    realm === "Voljin" ? "voljin" : realm === "Chantséternels" ? "chants-eternels" : realm;

  const percentage = Math.floor((score / votes.length) * 100);

  const notificationSuccess = () => {
    notification.success({
      message: "Vote réussi",
      description: "Votre vote a bien été pris en compte",
    });
  };

  const notificationFailure = () => {
    notification.error({
      message: "Erreur de vote",
      description: "Une erreur est survenue lors du vote",
    });
  };

  const onEdit = () => {
    router.push(`/apply/${router.query.id}/edit`);
  };

  const onDelete = async () => {
    try {
      setLoadingDelete(true);
      await db.collection("applies").doc(router.query.id.toString()).delete();
      await fetch("/api/statusNotification", {
        method: "POST",
        body: JSON.stringify({
          user: user.pseudo,
          name: data.name,
          state: "delete",
        }),
      });
      router.push("/applies");
    } catch (err) {
      setLoadingDelete(false);
      message.error("Une erreur est survenue lors de la suppression.");
      console.log(err);
    }
  };

  const onVote = async (value) => {
    const pos = votes.findIndex((elt) => elt.user_id === user.uid);

    try {
      const voteRef = db
        .collection("applies")
        .doc(router.query.id.toString())
        .collection("votes")
        .doc(user.uid);
      await voteRef.set({
        user_id: user.uid,
        value,
      });
    } catch (err) {
      console.error(err);
      notificationFailure();
    }

    if (pos === -1) {
      const newVotes = [...votes, { value: value, author_id: user.uid }];
      setVotes(newVotes);
      setScore(newVotes.reduce((acc, val) => acc + (val.value === 1 ? 1 : 0), 0));
    } else if (votes[pos].value !== value) {
      const newVotes = votes;
      newVotes[pos].value = value;
      setVotes(newVotes);
      setScore(newVotes.reduce((acc, val) => acc + (val.value === 1 ? 1 : 0), 0));
    }

    notificationSuccess();
  };

  const onStatusChange = async (change) => {
    try {
      await db.collection("applies").doc(router.query.id.toString()).update({
        state: change,
      });

      await fetch("/api/statusNotification", {
        method: "POST",
        body: JSON.stringify({
          user: user.pseudo,
          name: data.name,
          state: change,
        }),
      });
    } catch (err) {
      console.log(err);
      message.error("Une erreur est survenue lors de la modification.");
    }
  };

  return (
    <>
      <DateContent>
        <p>Posté le : {creationDate}</p>
        {editDate && <p className="last">Dernière édition : {editDate}</p>}
      </DateContent>
      <Content>
        <Typography.Title level={4}>Nom du personnage</Typography.Title>
        <p>{data.content[0]}</p>
        <Typography.Title level={4}>Depuis quand jouez vous à WoW ?</Typography.Title>
        <p>{data.content[1]}</p>
        <Typography.Title level={4}>Pourquoi voulez-vous nous rejoindre ?</Typography.Title>
        <p>{ReactHtmlParser(sanitizeHtml(data.content[2]))}</p>
        <Typography.Title level={4}>Quelles sont vos anciennes guildes ?</Typography.Title>
        <p>{ReactHtmlParser(sanitizeHtml(data.content[3]))}</p>
        <Typography.Title level={4}>Présentez vous</Typography.Title>
        <p>{ReactHtmlParser(sanitizeHtml(data.content[4]))}</p>
        <Typography.Title level={4}>Présentez votre personnage</Typography.Title>
        <p>{ReactHtmlParser(sanitizeHtml(data.content[5]))}</p>
        <Typography.Title level={4}>
          Avez vous des personnages dans d'autres guildes ?
        </Typography.Title>
        <p>{data.content[6].toLowerCase() === "oui" ? "Oui" : "Non"}</p>
        {data.content[6].toLowerCase() === "oui" && (
          <>
            <Typography.Title level={4}>Indiquez le nom des guildes</Typography.Title>
            <p>{data.content[7]}</p>
          </>
        )}
        <Typography.Title level={4}>Avez-vous un micro / casque ?</Typography.Title>
        <p>{data.content[8].toLowerCase() === "oui" ? "Oui" : "Non"}</p>
        <Typography.Title level={4}>Combien d'heures jouez vous par semaine ?</Typography.Title>
        <p>{data.content[9]}</p>
        {rio.name != null && (
          <ScoreRow gutter={16} className="scores">
            {rio.mythic_plus_scores_by_season != null && (
              <Col>
                <Statistic
                  title="M+"
                  value={rio.mythic_plus_scores_by_season[0].scores.all}
                  groupSeparator=""
                />
              </Col>
            )}
            {rio.raid_progression != null && (
              <Col>
                <Statistic
                  title="Raid"
                  value={rio.raid_progression["sepulcher-of-the-first-ones"].summary}
                />
              </Col>
            )}
          </ScoreRow>
        )}
        {canVote(user.role) && (
          <Row justify="center">
            <Col>
              <Progress
                gapDegree={140}
                type="dashboard"
                percent={percentage}
                width={95}
                style={{ paddingTop: "10px" }}
                success={{ percent: 0 }}
                format={(percent) => (
                  <div style={{ paddingTop: "7px" }}>
                    {percent}%<br />
                    {votes.length} vote{votes.length > 1 ? "s" : ""}
                  </div>
                )}
                strokeColor={percentage <= 50 ? "#ffa39e" : "#b7eb8f"}
              />
              <Row gutter={8}>
                <Col>
                  <Button type="primary" onClick={() => onVote(1)}>
                    +1
                  </Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => onVote(-1)} danger>
                    -1
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
        <SectionRow justify="center" gutter={16}>
          <Col>
            <a
              href={`https://raider.io/characters/eu/${formattedRealm}/${name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/raider-io.png" width="64rem" />
            </a>
          </Col>
          <Col>
            <a
              href={`https://www.warcraftlogs.com/character/eu/${formattedRealm}/${name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/wcl.png" width="64rem" />
            </a>
          </Col>
          <Col>
            <a
              href={`https://worldofwarcraft.com/fr-fr/character/eu/${formattedRealm}/${name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/wow.png" width="64rem" />
            </a>
          </Col>
        </SectionRow>
        {canEdit(user.role, data.author_id, user.uid) && (
          <SectionRow gutter={8}>
            <Col>
              <Button icon={<EditOutlined />} onClick={onEdit} type="primary">
                Edit
              </Button>
            </Col>
            <Col>
              <Button
                icon={<DeleteOutlined />}
                danger
                type="primary"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Delete
              </Button>
            </Col>
            {canModerate(user.role) && (
              <Col>
                <Select
                  defaultValue={data.status}
                  onChange={onStatusChange}
                  style={{ width: "8rem" }}
                >
                  <Option value="pending">En attente</Option>
                  <Option value="test">En test</Option>
                  <Option value="reject">Refusé</Option>
                  <Option value="accept">Accepté</Option>
                </Select>
              </Col>
            )}
          </SectionRow>
        )}
      </Content>
      <Divider orientation="left">
        <Typography.Title level={2}>Commentaires ({comments.length})</Typography.Title>
      </Divider>
      {comments.length === 0 ? (
        <Empty description="Aucun commentaire" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <CommentSection data={comments} />
      )}
      <Divider orientation="left">
        <Typography.Title level={2}>Nouveau Commentaire</Typography.Title>
      </Divider>
      <CommentCreator user={user} setComments={setComments} applyId={router.query.id.toString()} />
      <Modal
        title="Supprimer la candidature"
        visible={showModal}
        onOk={onDelete}
        onCancel={() => setShowModal(false)}
        okButtonProps={{ danger: true, loading: loadingDelete }}
        okText="Supprimer"
      >
        Voulez-vous vraiment supprimer cette candidature ?<br />
        Cette action est irreversible.
      </Modal>
    </>
  );
};

export default ApplyContent;
