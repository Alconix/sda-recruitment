import React from "react";
import styled from "styled-components";
import { Row } from "antd";

import { Paper } from "./Layout.styles";
import { Container } from "./Auth.styles";
import Sidebar from "./Sidebar";
import Device from "./Device";

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

  a,
  a:hover,
  a:focus,
  a:active {
    color: inherit;
    text-decoration: none;
  }
`;

const Background = styled.div`
  background-image: url(/background-df.png);
  background-size: cover;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: 82% 10%;
  overflow-x: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

type PropsType = {
  children: any;
  user?: any;
  auth?: boolean;
  sidebar?: boolean;
};

const Layout = ({ auth, children, user, sidebar = false, ...props }: PropsType) => (
  <Device>
    {({ isMobile }) => {
      if (isMobile) {
        if (auth) {
          return (
            <Background mobile>
              <Container mobile>{children}</Container>
              <Sidebar show={sidebar} user={user} />
            </Background>
          );
        } else {
          return (
            <>
              <Container mobile>{children}</Container>
              <Sidebar show={sidebar} user={user} />
            </>
          );
        }
      } else {
        return (
          <Background>
            <Sidebar show={sidebar} user={user} />
            <Container>
              {auth ? (
                <Row justify="center" align="middle">
                  {children}
                </Row>
              ) : (
                <Row justify="center" align="middle">
                  <Paper>{children}</Paper>
                </Row>
              )}
            </Container>
            <Footer>
              © 2019 - 2022 Secret des Anciens
              <br />
              <a
                href="https://raider.io/guilds/eu/voljin/Secret%20des%20Anciens"
                target="_blank"
                rel="noopener noreferrer"
              >
                Raider.IO
              </a>{" "}
              -{" "}
              <a
                href="https://www.warcraftlogs.com/guild/eu/voljin/Secret%20des%20Anciens"
                target="_blank"
                rel="noopener noreferrer"
              >
                Warcraftlogs
              </a>{" "}
            </Footer>
          </Background>
        );
      }
    }}
  </Device>
);

export default Layout;
