import React, { useState, useEffect } from "react";

import { Row, Col, Tabs } from "antd";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";

import firebaseInit from "../firebase";

import Login from "../components/Login";
import Signup from "../components/Signup";
import Layout from "../components/Layout";

import { Paper } from "../components/Auth.styles";

import "antd/dist/antd.css";

const { TabPane } = Tabs;

const IndexPage = () => {
  useEffect(() => {
    firebaseInit();
  }, []);

  return (
    <Layout>
      <Row justify='center' align='middle' style={{ display: "flex", height: "90vh" }}>
        <Col>
          <Paper defaultActiveKey='1' centered type='line' style={{ padding: "2rem" }}>
            <TabPane tab='Connexion' key='1'>
              <Login />
            </TabPane>
            <TabPane tab='Inscription' key='2'>
              <Signup />
            </TabPane>
          </Paper>
        </Col>
      </Row>
    </Layout>
  );
};

export default IndexPage;
