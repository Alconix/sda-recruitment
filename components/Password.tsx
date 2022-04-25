import React, { useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Row, Col, Typography } from "antd";
import { GoogleOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

import { StyledForm } from "./Auth.styles";
import firebase from "../firebase";

const iconStyle = { color: "rgb(133, 133, 133)" };

const PasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await firebase.auth().sendPasswordResetEmail(values.email);
      router.push("/auth");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <StyledForm onFinish={handleSubmit} initialValues={{ email: router.query.email }}>
      <Typography.Title level={4} style={{ marginBottom: "1rem" }}>
        Mot de passe oublié
      </Typography.Title>
      <Form.Item
        name="email"
        style={{ width: "16rem" }}
        hasFeedback
        rules={[
          { type: "email", message: "Veuillez entrer un email valide !" },
          { required: true, message: "Veuillez entrer votre email !" },
        ]}
      >
        <Input prefix={<MailOutlined style={iconStyle} />} placeholder="Email" />
      </Form.Item>
      <Button
        type="primary"
        block
        htmlType="submit"
        loading={loading}
        style={{ width: "16rem", marginTop: "1rem" }}
      >
        Envoyer
      </Button>
    </StyledForm>
  );
};

export default PasswordReset;
