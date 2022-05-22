import React from "react";
import Head from "next/head";

import Password from "../components/Password";
import Layout from "../components/Layout";

const PasswordPage = () => {
  return (
    <>
      <Head>
        <title>Réinitialiser le mot de passe | Secret des Anciens</title>
      </Head>
      <Layout>
        <Password />
      </Layout>
    </>
  );
};

export default PasswordPage;
