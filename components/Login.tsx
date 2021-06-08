import React from "react";

import { GoogleOutlined, LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Row, Col, Tabs, Form, Input, Checkbox, Button, Divider } from "antd";

import { Paper, Container, Background, StyledForm } from "./Login.styles";

const { TabPane } = Tabs;

const iconStyle = { color: "rgb(133, 133, 133)" };

export const Login = () => (
  <StyledForm>
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
        <Form.Item name='remember-me'>
          <Checkbox value='yes'>Se rappeler</Checkbox>
        </Form.Item>
      </Col>
      <Col flex='auto' />
      <Col>
        <Button type='link'>Mot de passe oublié</Button>
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

export const Signup = () => (
  <StyledForm>
    <Form.Item
      hasFeedback
      name='pseudo'
      rules={[{ required: true, message: "Veuillez entrer votre pseudo !" }]}
    >
      <Input prefix={<UserOutlined style={iconStyle} />} placeholder='Pseudo' />
    </Form.Item>
    <Form.Item
      hasFeedback
      name='email'
      rules={[
        { type: "email", message: "Veuillez entrer un email valide !" },
        { required: true, message: "Veuillez entrer votre email !" },
      ]}
    >
      <Input prefix={<MailOutlined style={iconStyle} />} placeholder='Email' />
    </Form.Item>
    <Form.Item
      hasFeedback
      name='password'
      rules={[{ required: true, message: "Veuillez entrer votre mot de passe !" }]}
    >
      <Input.Password prefix={<LockOutlined style={iconStyle} />} placeholder='Mot de passe' />
    </Form.Item>
    <Form.Item
      hasFeedback
      name='cpassword'
      rules={[
        { required: true, message: "Veuillez confirmer votre mot de passe !" },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue("password") === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("Les deux mot de passe ne correspondent pas !"));
          },
        }),
      ]}
    >
      <Input.Password
        prefix={<LockOutlined style={iconStyle} />}
        placeholder='Confirmer le mot de passe'
      />
    </Form.Item>
    <Button type='primary' htmlType='submit' block style={{ marginTop: "2rem" }}>
      Valider
    </Button>
  </StyledForm>
);
