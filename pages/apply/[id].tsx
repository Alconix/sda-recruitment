import React, { VFC } from "react";
import { Row, Typography } from "antd";
import { withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";

import { db, storage } from "../../firebase/admin";
import { isAvatarValid } from "../../utils/avatar";

import Layout from "../../components/Layout";
import ApplyContent from "../../components/ApplyContent";
import { Paper } from "../../components/Layout.styles";
import { canVote } from "../../utils/permissions";

type ApplyDataType = {
  isMember: boolean;
  apply: any;
  user: any;
  rio: any;
};

const ApplyPage: VFC<ApplyDataType> = ({ apply, user, rio }) => {
  return (
    <Layout sidebar user={user}>
      <Row justify="center" align="middle" style={{ height: "100%" }}>
        <Paper>
          <Typography.Title level={2}>Candidature de {apply.name}</Typography.Title>
          <ApplyContent data={apply} user={user} rio={rio} />
        </Paper>
      </Row>
    </Layout>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  try {
    const id = req.url.match(/apply\/([^\/|.]+)/)[1];

    const applyDoc = db.collection("appli").doc(id);

    const user = await db.collection("users").doc(AuthUser.id).get();
    const res = await applyDoc.get();

    if (!canVote(user.data().role) && res.data().author_id !== AuthUser.id) {
      return {
        redirect: {
          permanent: false,
          destination: `/`,
        },
      };
    }

    const comments = await applyDoc.collection("comments").get();
    const votes = await applyDoc.collection("votes").get();
    const author = await db.collection("users").doc(res.data().author_id).get();

    const commentList = [];
    for (const comment of comments.docs) {
      const data = comment.data();
      const author = await db.collection("users").doc(comment.data().author_id).get();

      data.date = data.date.seconds * 1000;
      if (data.editDate) data.editDate = data.editDate.seconds * 1000;
      data.author = author.data().pseudo;

      const avatarFile = storage.bucket().file(`users/${author.id}/avatar.png`);
      const avExists = await avatarFile.exists();

      data.pp = "NA";
      if (avExists[0]) {
        const signedUrl = await avatarFile.getSignedUrl({
          action: "read",
          expires: new Date().setHours(new Date().getHours() + 24),
        });

        data.pp = signedUrl[0];
      }

      commentList.push(data);
    }

    const voteList = [];
    for (const vote of votes.docs) {
      const data = vote.data();
      voteList.push(data);
    }

    const name = res.data().content[0].split("-", 2)[0];
    const realm = res.data().content[0].split("-", 2)[1].replace("'", "");

    const rioReq = await fetch(
      `https://raider.io/api/v1/characters/profile?region=eu&realm=${realm}&name=${name}&fields=raid_progression,mythic_plus_scores_by_season:current`
    );

    const rio = await rioReq.json();

    const myAvatarValid = await isAvatarValid(user.data().img);
    const userData = user.data();
    userData.pp = myAvatarValid ? user.data().img : "NA";
    userData.uid = AuthUser.id;

    const apply: { [k: string]: any } = {
      name: author.data().pseudo,
      author_id: res.data().author_id,
      content: res.data().content,
      date: res.data().date.seconds * 1000,
      status: res.data().state,
      comments: commentList,
      votes: voteList,
    };

    if (res.data().editDate) apply.editDate = res.data().editDate.seconds * 1000;

    return {
      props: {
        apply,
        user: userData,
        rio,
      },
    };
  } catch (err) {
    console.log(err);
  }
});

export default withAuthUser<ApplyDataType>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ApplyPage);
