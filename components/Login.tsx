import React, { useState } from "react";
import { useRouter } from "next/router";

import { Row, Col, Form, Input, Checkbox, Button, Divider, message } from "antd";

import { GoogleOutlined, LockOutlined, MailOutlined } from "../utils/icons";
import { StyledForm } from "./Auth.styles";
import firebase from "../firebase";

const iconStyle = { color: "rgb(133, 133, 133)" };

export const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const tError = (error): string => {
    if (error.code === "auth/too-many-requests")
      return "Vous avez atteint le nombre maximum d'essais. Veuillez réessayer plus tard.";
    else if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found")
      return "Email ou mot de passe incorrect.";
    else return error;
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    if (values.remember) await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    else firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

    try {
      await firebase.auth().signInWithEmailAndPassword(values.email, values.password);
    } catch (err) {
      message.error({
        content: tError(err),
        style: {
          marginTop: "5rem",
        },
      });

      console.log(err);
      setLoading(false);
    }
  };

  const forgotPassword = () => {
    const email = form.getFieldValue("email");
    if (email && email !== "") router.push(`/password-reset?email=${email}`);
    else router.push("/password-reset");
  };

  return (
    <StyledForm onFinish={handleSubmit} initialValues={{ remember: true }} form={form}>
      <Form.Item
        name="email"
        hasFeedback
        rules={[
          { type: "email", message: "Veuillez entrer un email valide !" },
          { required: true, message: "Veuillez entrer votre email !" },
        ]}
      >
        <Input prefix={<MailOutlined style={iconStyle} />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        hasFeedback
        rules={[{ required: true, message: "Veuillez entrer votre mot de passe !" }]}
      >
        <Input.Password prefix={<LockOutlined style={iconStyle} />} placeholder="Mot de passe" />
      </Form.Item>
      <Row>
        <Col>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Se rappeler</Checkbox>
          </Form.Item>
        </Col>
        <Col flex="auto" />
        <Col>
          <Button type="link" onClick={forgotPassword}>
            Mot de passe oublié
          </Button>
        </Col>
      </Row>
      <Button type="primary" block htmlType="submit" loading={loading}>
        Valider
      </Button>
      <Divider plain>Ou</Divider>
      <Button type="default" danger block icon={<GoogleOutlined />} disabled>
        Connexion avec Google
      </Button>
    </StyledForm>
  );
};

export default Login;
