import React from "react";

import { Table, Skeleton, Typography } from "antd";

import Layout from "../Layout";

const cols: any[] = [
  {
    title: "Pseudo",
    dataIndex: "pseudo",
    width: 300,
    render: () => <Skeleton.Input active size="small" />,
  },
  {
    title: "Inscription",
    dataIndex: "creationDate",
    width: 300,
    responsive: ["md"],
    render: () => <Skeleton.Input active size="small" />,
  },
  {
    title: "Role",
    dataIndex: "role",
    width: 300,
    render: () => <Skeleton.Input active size="small" />,
  },
];

const emptyUser = (key) => ({
  key,
  pseudo: "",
  creationDate: "",
  role: "",
});

const makeUsers = (amount) => {
  const users = new Array(amount);
  for (let i = 0; i < amount; i++) {
    users[i] = emptyUser(i);
  }

  return users;
};

const UserTableSkeleton = () => {
  const users = makeUsers(10);

  return (
    <Layout sidebar user={{}}>
      <Typography.Title level={2}>Utilisateurs</Typography.Title>
      <Table dataSource={users} columns={cols} />
    </Layout>
  );
};

export default UserTableSkeleton;
