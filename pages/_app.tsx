import React, { useState, useEffect } from "react";
import Router from "next/router";
import Head from "next/head";

import type { AppProps } from "next/app";

import initAuth from "../utils/initAuth";
import ApplySkeleton from "../components/Skeletons/ApplySkeleton";
import ApplyTableSkeleton from "../components/Skeletons/ApplyTableSkeleton";
import UserTableSkeleton from "../components/Skeletons/UserTableSkeleton";

import "antd/dist/antd.min.css";

initAuth();

const App = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };

    const end = () => {
      setLoading(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  let component = <Component {...pageProps} />;

  if (loading && Router.router._inFlightRoute === "/applies") component = <ApplyTableSkeleton />;
  if (loading && Router.router._inFlightRoute.startsWith("/apply/")) component = <ApplySkeleton />;
  if (loading && Router.router._inFlightRoute === "/users") component = <UserTableSkeleton />;

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </Head>
      {component}
    </>
  );
};

export default App;
