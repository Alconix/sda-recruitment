import React from "react";
import { Container } from "../components/Auth.styles";
import styled from "styled-components";

import Sidebar from "./Sidebar";

const Footer = styled.footer`
  color: white;
  z-index: 2;
  bottom: 0;
  width: 100%;
  text-align: center;
  text-shadow: 1px 1px 8px #fff, 1px 1px 8px #ccc;
  margin-bottom: 5px;
  padding-right: 50px;
  flex-shrink: 0;
`;

type PropsType = {
  children: any;
  user?: any;
  sidebar?: boolean;
};

const Layout = ({ children, user, sidebar = false, ...props }: PropsType) => {
  return (
    <div
      style={{
        backgroundImage: "url(/background-df.png)",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        //backgroundPosition: "center",
        top: 0,
        left: 10,
        bottom: 0,
        overflowX: "hidden",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Sidebar show={sidebar} user={user} />
      <Container>{children}</Container>
      <Footer>© 2019 - 2022 Secret des Anciens</Footer>
    </div>
  );
};

export default Layout;
