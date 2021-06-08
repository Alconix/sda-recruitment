import React, { useEffect, useState } from "react";

import firebase from "firebase/app";
import "firebase/auth";

import firebaseInit from "../firebase";

import { Login, Signup } from "../components/Login";
import "antd/dist/antd.css";

import { GoogleOutlined, LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Row, Col, Tabs, Form, Input, Checkbox, Button, Divider } from "antd";

import { Paper, Container, Background, StyledForm } from "../components/Login.styles";

const { TabPane } = Tabs;

firebaseInit();

const IndexPage = () => {
  return (
    <>
      <Background />
      <Container>
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
      </Container>
    </>
  );
};

export default IndexPage;
