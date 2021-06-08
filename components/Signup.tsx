import React, { useEffect } from "react";

import { useRouter } from "next/router";

import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";

import firebase from "firebase/app";
import "firebase/auth";

import firebaseInit from "../firebase";

import { StyledForm } from "./Auth.styles";

const iconStyle = { color: "rgb(133, 133, 133)" };

const Signup = () => {
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
    await firebase.auth().createUserWithEmailAndPassword(values.email, values.password);

    const user = firebase.auth().currentUser;
    await user.updateProfile({ displayName: values.pseudo });
  };

  return (
    <StyledForm onFinish={handleSubmit}>
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
};

export default Signup;
