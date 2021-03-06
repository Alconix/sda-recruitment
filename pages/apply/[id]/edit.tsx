import React, { VFC } from "react";
import { Typography } from "antd";
import Head from "next/head";
import { withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";

import { db } from "../../../firebase/admin";
import Layout from "../../../components/Layout";
import ApplyCreation from "../../../components/ApplyCreation";
import { canEdit } from "../../../utils/permissions";

type EditDataType = {
  user: any;
  apply: any;
  author: string;
};

const EditApply: VFC<EditDataType> = ({ user, apply, author }) => {
  return (
    <>
      <Head>
        <title>Modifier une cadidature | Secret des Anciens</title>
      </Head>
      <Layout sidebar user={user}>
        <Typography.Title level={2}>Modification candidature de {author}</Typography.Title>
        <ApplyCreation user={user} edit apply={apply} author={author} />
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
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

    const applyId = req.url.match(/apply\/([^\/|.]+)/)[1];

    const apply = await db.collection("applies").doc(applyId).get();
    const author = await db.collection("users").doc(apply.data().author_id).get();

    const allowed = canEdit(user.data().role, apply.data().author_id, userData.uid);

    if (!allowed) {
      return {
        redirect: {
          permanent: false,
          destination: `/apply/${applyId}`,
        },
      };
    }

    return {
      props: {
        user: userData,
        apply: apply.data().content,
        author: author.data().pseudo,
      },
    };
  } catch (err) {
    console.error(err);
    if (err.codePrefix === "auth") {
      return {
        props: {} as never,
      };
    }
  }
});

export default withAuthUser<EditDataType>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(EditApply);
