import React from "react";

import { Skeleton, Table, Typography } from "antd";

import Layout from "../Layout";

const cols: any[] = [
  {
    title: "Nom",
    width: 300,
    render: () => <Skeleton.Input active size="small" />,
  },
  {
    title: "Date",
    width: 200,
    align: "center",
    responsive: ["md"],
    render: () => <Skeleton.Input active size="small" />,
  },
  {
    title: "Commentaires",
    width: 20,
    align: "center",
    render: () => <Skeleton.Input active size="small" />,
  },
  {
    title: "Votes",
    className: "score-column",
    align: "center",
    responsive: ["lg"],
    render: () => <Skeleton.Input active size="small" />,
  },
  {
    title: "Etat",
    dataIndex: "status",
    align: "center",
    render: () => <Skeleton.Input active size="small" />,
  },
];

const emptyApply = (key) => ({
  key,
  name: "",
  date: "",
  comments: "",
  votes: "",
  status: "",
});

const makeApplies = (amount) => {
  const applies = new Array(amount);
  for (let i = 0; i < amount; i++) {
    applies[i] = emptyApply(i);
  }

  return applies;
};

const ApplyTableSkeleton = () => {
  const applies = makeApplies(10);

  return (
    <Layout sidebar user={{}}>
      <Typography.Title level={2}>Candidatures</Typography.Title>
      <Table dataSource={applies} columns={cols} />
    </Layout>
  );
};

export default ApplyTableSkeleton;
