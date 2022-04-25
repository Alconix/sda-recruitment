import React, { VFC } from "react";

import Layout from "../components/Layout";
import { withAuthUser, withAuthUserTokenSSR, AuthAction } from "next-firebase-auth";

type IndexDataType = {
  applies: any[];
  user: any;
};

const IndexPage: VFC<IndexDataType> = ({ user }) => {
  return (
    <Layout sidebar={user != undefined} user={user}>
      <div />
    </Layout>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()(async ({ AuthUser, req }) => {
  try {
    if (AuthUser.id === null) {
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    }

    return {
      redirect: {
        destination: "/applies",
        permanent: false,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      props: {} as never,
    };
  }
});

export default withAuthUser<IndexDataType>({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(IndexPage);
