import React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Menu } from "antd";
import Icon from "@ant-design/icons";

import {
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  ContainerOutlined,
} from "../utils/icons";

import firebase from "../firebase";
import { canVote } from "../utils/permissions";
import Device from "./Device";

const { Item, SubMenu } = Menu;

const DesktopMenu = styled(Menu).attrs(() => ({
  theme: "dark",
}))`
  position: fixed;
  left: 0;
  right: 0;
  z-index: 2;
  margin-right: 20px;
  width: 20rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MobileMenu = styled(Menu).attrs(() => ({
  theme: "dark",
}))`
  position: fixed;
  margin-top: 1rem;
  width: 100%;
  bottom: 0;
  z-index: 2;
  height: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  .ant-menu-title-content {
    margin-left: 0 !important;
  }
`;

const DiscordSvg = () => (
  <svg height="100" viewBox="0 -50 719 429.8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M61.7958 16.494C57.0736 14.2846 52.0244 12.6789 46.7456 11.7646C46.0973 12.9367 45.3399 14.5132 44.8177 15.7673C39.2062 14.9234 33.6463 14.9234 28.138 15.7673C27.6159 14.5132 26.8413 12.9367 26.1872 11.7646C20.9027 12.6789 15.8477 14.2905 11.1255 16.5057C1.60078 30.8988 -0.981215 44.9344 0.309785 58.7707C6.62708 63.4883 12.7493 66.3541 18.7682 68.2294C20.2543 66.1841 21.5797 64.0099 22.7215 61.7185C20.5469 60.8922 18.4641 59.8725 16.4961 58.6887C17.0182 58.3019 17.5289 57.8975 18.0223 57.4814C30.0257 63.0957 43.0677 63.0957 54.9277 57.4814C55.4269 57.8975 55.9375 58.3019 56.4539 58.6887C54.4801 59.8783 52.3916 60.898 50.217 61.7244C51.3588 64.0099 52.6785 66.19 54.1703 68.2352C60.195 66.3599 66.3229 63.4942 72.6402 58.7707C74.155 42.7309 70.0525 28.8242 61.7958 16.494ZM24.3568 50.2615C20.7535 50.2615 17.7985 46.8976 17.7985 42.8012C17.7985 38.7048 20.6904 35.3351 24.3568 35.3351C28.0233 35.3351 30.9782 38.6989 30.9151 42.8012C30.9208 46.8976 28.0233 50.2615 24.3568 50.2615ZM48.5932 50.2615C44.9899 50.2615 42.0349 46.8976 42.0349 42.8012C42.0349 38.7048 44.9267 35.3351 48.5932 35.3351C52.2596 35.3351 55.2146 38.6989 55.1515 42.8012C55.1515 46.8976 52.2596 50.2615 48.5932 50.2615Z"
      fill="white"
    />
  </svg>
);

const DiscordIcon = (props) => <Icon component={DiscordSvg} {...props} />;

const Sidebar = ({ user, show = false }) => {
  const router = useRouter();

  const handleDisconnect = async () => {
    await firebase.auth().signOut();
    router.reload();
  };

  const items: any[] = [
    { label: null, key: "home", icon: <HomeOutlined />, onClick: () => router.push("/home") },
  ];

  if (canVote(user?.role)) {
    items.push({
      label: "",
      key: "applies",
      icon: <ContainerOutlined />,
      onClick: () => router.push("/applies"),
    });

    items.push({
      label: "",
      key: "members",
      icon: <TeamOutlined />,
      onClick: () => router.push("/users"),
    });
  }

  items.push({
    label: "",
    key: "user",
    icon: <UserOutlined />,
    popupOffset: [-50, -150],
    children: [
      {
        label: "Paramètres",
        key: "settings",
        icon: <SettingOutlined />,
        onClick: () => router.push("/profile"),
      },
      {
        label: "Déconnexion",
        key: "logout",
        icon: <LogoutOutlined />,
        onClick: handleDisconnect,
      },
    ],
  });

  if (!show || !user) return null;

  const desktop = (
    <DesktopMenu mode="inline" inlineCollapsed selectable={false}>
      <Item icon={<HomeOutlined />} key="home-menu" onClick={() => router.push("/home")}>
        Accueil
      </Item>
      {canVote(user?.role) && (
        <Item
          icon={<ContainerOutlined />}
          key="applies-menu"
          onClick={() => router.push("/applies")}
        >
          Candidatures
        </Item>
      )}
      {canVote(user?.role) && (
        <Item icon={<TeamOutlined />} key="users-menu" onClick={() => router.push("/users")}>
          Membres
        </Item>
      )}
      <Item
        icon={
          <a href="https://discord.gg/RbcbBsD" target="_blank" rel="noopener noreferrer">
            <DiscordIcon />
          </a>
        }
        style={{
          marginTop: "auto",
        }}
        key="discord-menu"
      >
        Discord
      </Item>
      <SubMenu
        icon={<UserOutlined style={{ width: "100%" }} />}
        key="user-menu"
        popupOffset={[10, -70]}
      >
        <Item
          icon={<SettingOutlined />}
          key="settings-menu"
          onClick={() => router.push("/profile")}
        >
          Profil
        </Item>
        <Item icon={<LogoutOutlined />} onClick={handleDisconnect} key="disconnect-menu">
          Déconnexion
        </Item>
      </SubMenu>
    </DesktopMenu>
  );

  return (
    <Device>
      {({ isMobile }) => {
        if (isMobile) return <MobileMenu items={items} mode="horizontal" />;
        return desktop;
      }}
    </Device>
  );
};

export default Sidebar;
