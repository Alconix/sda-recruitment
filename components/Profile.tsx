import React, { useState } from "react";
import { Typography, Form, Input, Button, Row, Col, Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import { timestampToString } from "../utils/time";
import firebase from "../firebase";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("Veuillez choisir une image en PNG / JPG !");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Veuillez charger une image de moins de 2Mo !");
  }

  return isJpgOrPng && isLt2M;
};

const getBase64 = (img, cb) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => cb(reader.result));
  reader.readAsDataURL(img);
};

const Profile = ({ user, avatar }) => {
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState(avatar);

  const role = `${user.role[0].toUpperCase()}${user.role.slice(1)}`;

  const handleUpload = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (res) => {
        setImgUrl(res);
        setLoading(false);
      });
    }
  };

  const customUpload = async (options) => {
    const { onSuccess, onError, file } = options;
    const storage = firebase
      .app()
      .storage(`gs://${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`);

    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = await storage.ref();
    const imgFile = storageRef.child(`users/${user.id}/avatar.png`);

    try {
      const image = await imgFile.put(file, metadata);
      onSuccess(null, image);
    } catch (err) {
      console.log(err);
      onError(err);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: "1rem" }}>Upload</div>
    </div>
  );

  return (
    <>
      <Typography.Title level={2}>Mon profil</Typography.Title>
      <p>Role : {role}</p>
      <p>Inscription : {timestampToString(user.creationTime)}</p>
      <Form initialValues={{ pseudo: user.pseudo }}>
        Pseudo
        <Form.Item
          name="pseudo"
          labelCol={{ span: 24 }}
          hasFeedback
          rules={[{ required: true, message: "Veuillez entrer votre mot de passe !" }]}
        >
          <Input />
        </Form.Item>
        Avatar
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleUpload}
          customRequest={customUpload}
        >
          {imgUrl ? <img src={imgUrl} alt="avatar" style={{ width: "100%" }} /> : uploadButton}
        </Upload>
      </Form>
      <p style={{ marginTop: "2rem" }}>
        <Button type="primary">Valider</Button>
      </p>
    </>
  );
};

export default Profile;
