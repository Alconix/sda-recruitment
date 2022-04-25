import React from "react";
import { Row, Tabs } from "antd";

import Password from "../components/Password";
import Layout from "../components/Layout";
import { Paper } from "../components/Layout.styles";

const { TabPane } = Tabs;

const PasswordPage = () => {
  return (
    <Layout>
      <Row justify="center" align="middle" style={{ display: "flex", height: "100vh" }}>
        <Paper style={{ padding: "2rem", width: "20rem", height: "13rem" }}>
          <Password />
        </Paper>
      </Row>
    </Layout>
  );
};

export default PasswordPage;
