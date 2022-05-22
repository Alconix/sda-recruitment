import React, { VFC } from "react";
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import Head from "next/head";

import Layout from "../components/Layout";
import UserTable from "../components/UserTable";
import { db } from "../firebase/admin";
import { canVote } from "../utils/permissions";

type UsersDataType = {
  user: any;
  users: any;
};

const UsersPage: VFC<UsersDataType> = ({ user, users }) => {
  return (
    <>
      <Head>
        <title>Membres | Secret des Anciens</title>
      </Head>
      <Layout sidebar user={user}>
        <UserTable user={user} users={users} />
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  try {
    const user = await db.collection("users").doc(AuthUser.id).get();

    if (!canVote(user.data().role)) {
      return {
        redirect: {
          permanent: false,
          destination: `/`,
        },
      };
    }

    const users = await db.collection("users").get();

    const userList = [];
    for (const u of users.docs) {
      const data = u.data();
      data.id = u.id;
      data.lastSignInTime = data.lastSignInTime.seconds
        ? data.lastSignInTime.seconds * 1000
        : data.lastSignInTime;
      data.creationTime = data.creationTime.seconds
        ? data.creationTime.seconds * 1000
        : data.creationTime;
      userList.push(data);
    }

    return {
      props: {
        user: user.data(),
        users: userList,
      },
    };
  } catch (e) {
    console.log(e);
  }
});

export default withAuthUser<UsersDataType>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(UsersPage);
