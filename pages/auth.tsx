import React from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";

import { Row, Col, Tabs } from "antd";

import Head from "next/head";
import "firebase/auth";

import Login from "../components/Login";
import Signup from "../components/Signup";
import Layout from "../components/Layout";
import { Paper } from "../components/Auth.styles";

const { TabPane } = Tabs;

const Auth = () => {
  return (
    <>
      <Head>
        <title>Authentification | Secret des Anciens</title>
      </Head>
      <Layout auth>
        <Row justify="center" align="middle" style={{ display: "flex", height: "80vh" }}>
          <Col>
            <Paper defaultActiveKey="1" centered type="line">
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
    </>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);
