import React from "react";

import { withAuthUser, AuthAction } from "next-firebase-auth";
import { Row, Col, Tabs } from "antd";
import "firebase/auth";

import Login from "../components/Login";
import Signup from "../components/Signup";
import Layout from "../components/Layout";

import { Paper } from "../components/Auth.styles";

import "antd/dist/antd.css";

const { TabPane } = Tabs;

const Auth = () => {
  return (
    <Layout>
      <Row justify="center" align="middle" style={{ display: "flex", height: "100vh" }}>
        <Col>
          <Paper defaultActiveKey="1" centered type="line" style={{ padding: "2rem" }}>
            <TabPane tab="Connexion" key="1">
              <Login />
            </TabPane>
            <TabPane tab="Inscription" key="2">
              <Signup />
            </TabPane>
          </Paper>
        </Col>
      </Row>
    </Layout>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);
