import React from "react";
import { Typography, Table, notification, Tooltip, Select } from "antd";
import styled from "styled-components";

import firebase from "../firebase";
import { timeSince, timestampToString } from "../utils/time";
import { canModerate } from "../utils/permissions";

const db = firebase.firestore();
const { Option } = Select;

const StyledTable = styled(Table)`
  .user-row {
    height: 4rem;
  }
`;

const notificationSuccess = () => {
  notification.success({
    message: "Modification réussie",
    description: "Le role de l'utilisateur a bien été mit à jour.",
  });
};

const notificationFailure = () => {
  notification.error({
    message: "Erreur de modification",
    description: "Une erreur est survenue lors de la modification du role de l'utilisateur.",
  });
};

const UserTable = ({ user, users }) => {
  const onRoleChange = async (value, user) => {
    try {
      await db.collection("users").doc(user.id).update({
        role: value,
      });
      notificationSuccess();
    } catch (err) {
      console.error(err);
      notificationFailure();
    }
  };

  const columns: any[] = [
    {
      title: "Pseudo",
      width: 300,
      dataIndex: "pseudo",
      sorter: (a, b) => {
        if (a.pseudo < b.pseudo) return -1;
        else if (a.pseudo > b.pseudo) return 1;
        else return 0;
      },
    },
    {
      title: "Inscription",
      width: 300,
      dataIndex: "creationTime",
      sorter: (a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime(),
      render: (elt) => (
        <Tooltip title={timestampToString(elt)}>
          <span>{timeSince(elt)}</span>
        </Tooltip>
      ),
    },
  ];

  const roleData: { [k: string]: any } = {
    title: "Role",
    width: 300,
    dataIndex: "role",
    sorter: (a, b) => {
      if (a.role < b.role) return -1;
      else if (a.role > b.role) return 1;
      else return 0;
    },
  };

  if (canModerate(user.role)) {
    roleData.render = (elt, record) => {
      if (elt === "officier" || elt === "admin") {
        return "Officier";
      } else {
        return (
          <Select
            defaultValue={elt}
            onChange={(value) => onRoleChange(value, record)}
            style={{ width: "8rem" }}
          >
            <Option value="apply">Apply</Option>
            <Option value="membre">Membre</Option>
          </Select>
        );
      }
    };
  } else {
    roleData.render = (elt) => `${elt[0].toUpperCase()}${elt.slice(1)}`;
  }

  columns.push(roleData);

  return (
    <>
      <Typography.Title level={3}>Utilisateurs</Typography.Title>
      <StyledTable dataSource={users} columns={columns} rowClassName="user-row" />
    </>
  );
};

export default UserTable;
