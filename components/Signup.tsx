import React from "react";
import { useRouter } from "next/router";

import { Form, Input, Button } from "antd";

import firebase from "../firebase";
import { StyledForm } from "./Auth.styles";
import { LockOutlined, MailOutlined, UserOutlined } from "../utils/icons";

const iconStyle = { color: "rgb(133, 133, 133)" };

const Signup = () => {
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
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    await firebase.auth().createUserWithEmailAndPassword(values.email, values.password);

    const user = firebase.auth().currentUser;
    await user.updateProfile({ displayName: values.pseudo });

    await firebase.firestore().collection("users").doc(user.uid).set({
      creationTime: new Date(),
      lastSignInTime: new Date(),
      pseudo: values.pseudo,
      role: "apply",
    });

    redirectUser(router.query.from);
  };

  return (
    <StyledForm onFinish={handleSubmit}>
      <Form.Item
        hasFeedback
        name="pseudo"
        rules={[{ required: true, message: "Veuillez entrer votre pseudo !" }]}
      >
        <Input prefix={<UserOutlined style={iconStyle} />} placeholder="Pseudo" />
      </Form.Item>
      <Form.Item
        hasFeedback
        name="email"
        rules={[
          { type: "email", message: "Veuillez entrer un email valide !" },
          { required: true, message: "Veuillez entrer votre email !" },
        ]}
      >
        <Input prefix={<MailOutlined style={iconStyle} />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        hasFeedback
        name="password"
        rules={[{ required: true, message: "Veuillez entrer votre mot de passe !" }]}
      >
        <Input.Password prefix={<LockOutlined style={iconStyle} />} placeholder="Mot de passe" />
      </Form.Item>
      <Form.Item
        hasFeedback
        name="cpassword"
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
          placeholder="Confirmer le mot de passe"
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" block style={{ marginTop: "2rem" }}>
        Valider
      </Button>
    </StyledForm>
  );
};

export default Signup;
