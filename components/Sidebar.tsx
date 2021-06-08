import React, { useEffect } from "react";

import { useRouter } from "next/router";

import firebase from "firebase/app";
import "firebase/auth";

import { Menu } from "antd";
import { UserOutlined, HomeOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";

import firebaseInit from "../firebase";

import styled from "styled-components";

const { Item, SubMenu } = Menu;

const StyledMenu = styled(Menu).attrs(() => ({
  theme: "dark",
}))`
  position: fixed;
  left: 0;
  right: 0;
  z-index: 2;
  margin-left: 20px;
  margin-right: 20px;
  width: 20rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Sidebar = ({ show = false }) => {
  const router = useRouter();

  useEffect(() => {
    firebaseInit();
  }, []);

  const handleDisconnect = async () => {
    await firebase.auth().signOut();
    router.push("/auth");
  };

  if (!show) return null;

  return (
    <StyledMenu inlineCollapsed selectable={false}>
      <Item icon={<HomeOutlined />}>Accueil</Item>
      <SubMenu icon={<UserOutlined />} style={{ marginTop: "auto" }}>
        <Item icon={<SettingOutlined />}>Profil</Item>
        <Item icon={<LogoutOutlined />} onClick={handleDisconnect}>
          Déconnexion
        </Item>
      </SubMenu>
    </StyledMenu>
  );
};

export default Sidebar;
