import React, { VFC } from "react";
import { withAuthUserSSR, withAuthUser, AuthAction } from "next-firebase-auth";
import { Row } from "antd";

import Layout from "../components/Layout";
import { Paper } from "../components/Layout.styles";
import Profile from "../components/Profile";
import { db, storage } from "../firebase/admin";
import { timestampToString } from "../utils/time";

type ProfileDataType = {
  user: any;
  avatar?: any;
};

const ProfilePage: VFC<ProfileDataType> = ({ user, avatar }) => {
  return (
    <Layout sidebar user={user}>
      <Row justify="center" align="middle">
        <Paper>
          <Profile user={user} avatar={avatar} />
        </Paper>
      </Row>
    </Layout>
  );
};

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  try {
    if (AuthUser.id === null) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const user = await db.collection("users").doc(AuthUser.id).get();
    const userData = user.data();

    userData.lastSignInTime = userData.lastSignInTime.seconds
      ? userData.lastSignInTime.seconds * 1000
      : userData.lastSignInTime;
    userData.creationTime = userData.creationTime.seconds
      ? userData.creationTime.seconds * 1000
      : userData.creationTime;
    userData.id = user.id;

    const avatarFile = storage.bucket().file(`users/${user.id}/avatar.png`);
    const exists = await avatarFile.exists();

    let avatar = null;

    if (exists[0]) {
      const signedUrl = await avatarFile.getSignedUrl({
        action: "read",
        expires: new Date().setHours(new Date().getHours() + 24),
      });

      avatar = signedUrl[0];
    }

    return {
      props: {
        user: userData,
        avatar: avatar,
      },
    };
  } catch (err) {
    console.log(err);
  }
});

export default withAuthUser<ProfileDataType>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ProfilePage);
