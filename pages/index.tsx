import React, { useEffect } from "react";

import { Row, Col, Typography, Table } from "antd";
import { useRouter } from "next/router";
import styled from "styled-components";

import firebase from "firebase/app";
import "firebase/auth";

import Layout from "../components/Layout";

import "antd/dist/antd.css";

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) router.push("/auth");
    });
  }, []);

  const Paper = styled(Col)`
    width: 60rem;
    height: 100vh;
    background-color: white;
    padding: 2rem;

    position: relative;
    -webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
    -moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;

    :before,
    :after {
      content: "";
      position: absolute;
      z-index: -1;
      -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
      -moz-box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
      top: 10px;
      bottom: 10px;
      left: 0;
      right: 0;
      -moz-border-radius: 100px / 10px;
      border-radius: 100px / 10px;
    }

    :after {
      right: 10px;
      left: auto;
      -webkit-transform: skew(8deg) rotate(3deg);
      -moz-transform: skew(8deg) rotate(3deg);
      -ms-transform: skew(8deg) rotate(3deg);
      -o-transform: skew(8deg) rotate(3deg);
      transform: skew(8deg) rotate(3deg);
    }
  `;

  const data = [
    { name: "Apply", date: 14, comments: 4, votes: "18", status: "en test" },
    { name: "Bobby", date: 15, comments: 7, votes: "18", status: "accepted" },
    { name: "Zouloux", date: 16, comments: "6", votes: "18", status: "refused" },
    { name: "Z", date: 18, comments: "6", votes: "18", status: "en test" },
    { name: "A", date: "16 mars", comments: "6", votes: "18", status: "en test" },
    { name: "Apply", date: "16 mars", comments: "6", votes: "18", status: "en test" },
    { name: "Apply", date: "16 mars", comments: "6", votes: "18", status: "en test" },
    { name: "Apply", date: "16 mars", comments: "6", votes: "18", status: "en test" },
    { name: "Apply", date: "16 mars", comments: "6", votes: "18", status: "en test" },
  ];

  const columns = [
    {
      title: "Nom",
      dataIndex: "name",
      sorter: (a, b) => {
        if (a.name < b.name) return -1;
        else if (a.name > b.name) return 1;
        else return 0;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => a.date - b.date,
    },
    {
      title: "Commentaires",
      dataIndex: "comments",
    },
    {
      title: "Votes",
      dataIndex: "votes",
    },
    {
      title: "Etat",
      dataIndex: "status",
      sorter: (a, b) => {
        if (a.status < b.status) return -1;
        else if (a.status > b.status) return 1;
        else return 0;
      },
      onFilter: (value, record) => {
        return record.status === value;
      },
      filters: [
        {
          text: "En test",
          value: "en test",
        },
        {
          text: "En attente",
          value: "en attente",
        },
        {
          text: "Accepté",
          value: "accepted",
        },
        {
          text: "Refusé",
          value: "refused",
        },
      ],
    },
  ];

  return (
    <Layout sidebar>
      <Row justify='center' align='middle'>
        <Paper>
          <Typography.Title level={2}>Candidatures</Typography.Title>
          <Table dataSource={data} columns={columns} />
        </Paper>
      </Row>
    </Layout>
  );
};

export default IndexPage;
