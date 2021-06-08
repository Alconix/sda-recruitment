import React from "react";
import { Container, Background } from "../components/Auth.styles";

import Sidebar from "./Sidebar";

const Layout = ({ children, sidebar = false }) => {
  if (sidebar) console.log("sidebar");
  return (
    <>
      <Sidebar show={sidebar} />
      <Background />
      <Container>{children}</Container>
    </>
  );
};

export default Layout;
