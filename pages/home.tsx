import React, { VFC } from "react";
import Head from "next/head";
import { withAuthUserSSR, withAuthUser } from "next-firebase-auth";

import Layout from "../components/Layout";
import Home from "../components/Home";
import { db } from "../firebase/admin";

type HomeDataType = {
  user: any;
};

const HomePage: VFC<HomeDataType> = ({ user }) => {
  return (
    <>
      <Head>
        <title>Secret des Anciens</title>
      </Head>
      <Layout sidebar user={user}>
        <Home />
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthUserSSR()(async ({ AuthUser, req }) => {
  if (AuthUser.id === null) {
    return {
      props: {
        user: null,
      },
    };
  }

  try {
    const user = await db.collection("users").doc(AuthUser.id).get();

    const userData = user.data();

    userData.lastSignInTime = userData.lastSignInTime.seconds
      ? userData.lastSignInTime.seconds * 1000
      : userData.lastSignInTime;
    userData.creationTime = userData.creationTime.seconds
      ? userData.creationTime.seconds * 1000
      : userData.creationTime;

    return {
      props: {
        user: userData,
      },
    };
  } catch (err) {
    console.log(err);
  }
});

export default withAuthUser<HomeDataType>()(HomePage);
