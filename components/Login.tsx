import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { GoogleOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Row, Col, Form, Input, Checkbox, Button, Divider, message } from "antd";

import { StyledForm } from "./Auth.styles";

import firebaseInit from "../firebase";
import firebase from "firebase/app";
import "firebase/auth";

const iconStyle = { color: "rgb(133, 133, 133)" };

export const Login = () => {
  useEffect(() => {
    firebaseInit();
  }, []);

  const router = useRouter();

  const redirectUser = (location: string | string[]) => {
    switch (location) {
      case "profile":
        router.push("/profile");
        break;
      case "apply":
        if (router.query.id) router.push(`/apply/${router.query.id}`);
        else router.push("/");
        break;
      default:
        router.push("/");
        break;
    }
  };

  const handleSubmit = async (values: any) => {
    if (values.remember) await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    try {
      await firebase.auth().signInWithEmailAndPassword(values.email, values.password);
      redirectUser(router.query.from);
    } catch (err) {
      message.error("Email ou mot de passe incorrect !");
      console.log(err);
    }
  };

  return (
    <StyledForm onFinish={handleSubmit} initialValues={{ remember: true }}>
      <Form.Item
        name='email'
        hasFeedback
        rules={[
          { type: "email", message: "Veuillez entrer un email valide !" },
          { required: true, message: "Veuillez entrer votre email !" },
        ]}
      >
        <Input prefix={<MailOutlined style={iconStyle} />} placeholder='Email' />
      </Form.Item>
      <Form.Item
        name='password'
        hasFeedback
        rules={[{ required: true, message: "Veuillez entrez votre mot de passe !" }]}
      >
        <Input.Password prefix={<LockOutlined style={iconStyle} />} placeholder='Mot de passe' />
      </Form.Item>
      <Row>
        <Col>
          <Form.Item name='remember' valuePropName='checked'>
            <Checkbox>Se rappeler</Checkbox>
          </Form.Item>
        </Col>
        <Col flex='auto' />
        <Col>
          <Button type='link' disabled>
            Mot de passe oublié
          </Button>
        </Col>
      </Row>
      <Button type='primary' block htmlType='submit'>
        Valider
      </Button>
      <Divider plain>Ou</Divider>
      <Button type='default' danger block icon={<GoogleOutlined />} disabled>
        Connexion avec Google
      </Button>
    </StyledForm>
  );
};

export default Login;
