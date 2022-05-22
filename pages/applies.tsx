import React, { VFC } from "react";
import { Typography } from "antd";
import { withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";

import { canVote } from "../utils/permissions";
import Layout from "../components/Layout";
import ApplyTable from "../components/ApplyTable";
import ApplyCreation from "../components/ApplyCreation";
import { db } from "../firebase/admin";
import Head from "next/head";

type AppliesDataType = {
  applies: any[];
  user: any;
};

const AppliesPage: VFC<AppliesDataType> = ({ applies, user }) => {
  if (canVote(user.role)) {
    return (
      <>
        <Head>
          <title>Candidatures | Secret des Anciens</title>
        </Head>
        <Layout sidebar user={user}>
          <Typography.Title level={2}>Candidatures</Typography.Title>
          <ApplyTable data={applies} />
        </Layout>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Créer une candidature | Secret des Anciens</title>
        </Head>
        <Layout sidebar user={user}>
          <Typography.Title level={2}>Nouvelle candidature</Typography.Title>
          <ApplyCreation user={user} edit={false} apply={null} author={null} />
        </Layout>
      </>
    );
  }
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  try {
    const user = await db.collection("users").doc(AuthUser.id).get();
    const userData = user.data();

    userData.uid = AuthUser.id;
    userData.lastSignInTime = userData.lastSignInTime.seconds
      ? userData.lastSignInTime.seconds * 1000
      : userData.lastSignInTime;
    userData.creationTime = userData.creationTime.seconds
      ? userData.creationTime.seconds * 1000
      : userData.creationTime;

    const isMember = canVote(user.data().role);
    const res = await db.collection("applies").orderBy("date", "desc").get();

    const userApply = res.docs.find((doc) => doc.data().author_id === AuthUser.id);

    if (isMember) {
      const applies = [];

      for (const apply of res.docs) {
        const comments = await db.collection("applies").doc(apply.id).collection("comments").get();
        const votes = await db.collection("applies").doc(apply.id).collection("votes").get();
        const author = await db.collection("users").doc(apply.data().author_id).get();

        applies.push({
          id: apply.id,
          key: apply.id,
          name: author.data().pseudo,
          author_id: apply.data().author_id,
          content: apply.data().content,
          date: apply.data().date.seconds * 1000,
          status: apply.data().state,
          comments: comments.size,
          votes: {
            size: votes.size,
            score: votes.docs.reduce((acc, val) => acc + (val.data().value === 1 ? 1 : 0), 0),
          },
        });
      }

      return { props: { applies, user: userData } };
    } else {
      if (userApply != undefined) {
        return {
          redirect: {
            permanent: false,
            destination: `/apply/${userApply.id}`,
          },
          props: {} as never,
        };
      }

      return { props: { user: userData } };
    }
  } catch (err) {
    console.log(err);

    return {
      props: {} as never,
    };
  }
});

export default withAuthUser<AppliesDataType>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(AppliesPage);
