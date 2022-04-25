import React, { VFC } from "react";
import { Row } from "antd";
import { withAuthUserSSR, withAuthUser, AuthAction } from "next-firebase-auth";

import Layout from "../components/Layout";
import Home from "../components/Home";
import { Paper } from "../components/Layout.styles";
import { db } from "../firebase/admin";

type HomeDataType = {
  user: any;
};

const HomePage: VFC<HomeDataType> = ({ user }) => {
  return (
    <Layout sidebar user={user}>
      <Row justify="center" align="middle">
        <Paper>
          <Home />
        </Paper>
      </Row>
    </Layout>
  );
};

export const getServerSideProps = withAuthUserSSR()(async ({ AuthUser, req }) => {
  if (AuthUser.id === null) {
    return {
      props: {
        user: undefined,
      },
    };
  }

  try {
    const user = await db.collection("users").doc(AuthUser.id).get();

    return {
      props: {
        user: user.data(),
      },
    };
  } catch (err) {
    console.log(err);
  }
});

export default withAuthUser<HomeDataType>()(HomePage);
