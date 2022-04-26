import React, { useRef } from "react";
import { Comment, Avatar, Form, Button, Input, List } from "antd";
import sanitizeHtml from "sanitize-html";

import Editor from "./Editor";
import { getAvatarFromName, generateHSL } from "../utils/avatar";
import firebase from "../firebase";

const db = firebase.firestore();

const rules = [
  { required: true, message: "Veuillez entrer un message !" },
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

const CommentCreator = ({ user, setComments, applyId }) => {
  const [form] = Form.useForm();
  const editorRef = useRef(null);

  const onSubmit = async (values) => {
    const newComment: { [k: string]: any } = {
      author_id: user.uid,
      content: sanitizeHtml(values.comment.level.content),
      date: new Date(),
    };

    try {
      const commentRef = await db
        .collection("appli")
        .doc(applyId)
        .collection("comments")
        .add(newComment);

      newComment.pp = user.pp === "NA" ? "NA" : user.pp;
      newComment.key = commentRef.id;
      newComment.author = user.pseudo;

      setComments((old) => [...old, newComment]);
      editorRef.current.setContent("");
    } catch (err) {
      console.log(err);
    }
  };

  const avatar = user.pp === "NA" ? (
    <Avatar style={{ backgroundColor: generateHSL(user.pseudo) }}>
      {getAvatarFromName(user.pseudo)}
    </Avatar>
  ) : (
    <Avatar src={user.pp} alt={user.pseudo} />
  );

  return (
    <Comment
    avatar={avatar}
      content={
        <Form form={form} onFinish={(values) => onSubmit(values)}>
          <Form.Item
            name="comment"
            hasFeedback
            rules={rules}
            getValueProps={(value: any) => value?.level?.content}
          >
            <Editor textareaName="comment" onInit={(evt, editor) => (editorRef.current = editor)} />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Envoyer
          </Button>
        </Form>
      }
    />
  );
};

export default CommentCreator;
