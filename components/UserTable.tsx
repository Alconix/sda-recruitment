import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Typography, Table, notification, Tooltip, Select, Input, Space, Button } from "antd";

import firebase from "../firebase";
import { timeSince, timestampToString } from "../utils/time";
import { canModerate } from "../utils/permissions";
import { SearchOutlined } from "../utils/icons";

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
  const [searchName, setSearchName] = useState<any>("");
  const [data, setData] = useState(
    users.sort((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime())
  );

  let searchInput = undefined;

  const getColumnSearchNameProps = () => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder="Pseudo à rechercher"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: "8rem" }}
          >
            Rechercher
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: "4rem" }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchName(selectedKeys[0]);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record["pseudo"]
        ? record["pseudo"].toString().toLowerCase().includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchName(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchName("");
  };

  const onRoleChange = async (value, user, index) => {
    try {
      await db.collection("users").doc(user.id).update({
        role: value,
      });

      const newData = [...data];
      newData[index] = { ...newData[index], role: value };
      setData(newData);

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
      ...getColumnSearchNameProps(),
    },
    {
      title: "Inscription",
      width: 300,
      dataIndex: "creationTime",
      responsive: ["md"],
      sorter: (a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime(),
      render: (elt) => (
        <Tooltip title={timestampToString(elt)}>
          <span>{timeSince(elt)}</span>
        </Tooltip>
      ),
    },
  ];

  const roleDataMod = (elt, record, index) => {
    if (elt === "officier" || elt === "admin") {
      return "Officier";
    } else {
      return (
        <Select
          value={record.role}
          onChange={(value) => {
            onRoleChange(value, record, index);
            elt = value;
          }}
          style={{ width: "8rem" }}
        >
          <Option value="apply">Apply</Option>
          <Option value="membre">Membre</Option>
        </Select>
      );
    }
  };

  const roleDateUser = (elt) => `${elt[0].toUpperCase()}${elt.slice(1)}`;

  const roleData: { [k: string]: any } = {
    title: "Role",
    width: 300,
    dataIndex: "role",
    sorter: (a, b) => {
      if (a.role < b.role) return -1;
      else if (a.role > b.role) return 1;
      else return 0;
    },
    render: (elt, record, index) =>
      canModerate(user.role) ? roleDataMod(elt, record, index) : roleDateUser(elt),
  };

  columns.push(roleData);

  return (
    <>
      <Typography.Title level={2}>Utilisateurs</Typography.Title>
      <StyledTable
        sortOrder="descend"
        dataSource={data}
        columns={columns}
        rowClassName="user-row"
        onRow={(record, rowIndex) => {
          return {
            onClick: () => {
              console.log(record);
            },
          };
        }}
      />
    </>
  );
};

export default UserTable;
