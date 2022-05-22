import React from "react";
import { Skeleton } from "antd";

import Layout from "../Layout";

const ApplySkeleton = () => {
  return (
    <Layout sidebar user={{}}>
      <Skeleton active paragraph={{ rows: 0 }} />
      <Skeleton active title={false} paragraph={{ rows: 1 }} />
      <Skeleton active title={false} paragraph={{ rows: 1 }} />
      <Skeleton active paragraph={{ rows: 1 }} />
      <Skeleton active paragraph={{ rows: 1 }} />
      <Skeleton active paragraph={{ rows: 5 }} />
      <Skeleton active paragraph={{ rows: 2 }} />
      <Skeleton active paragraph={{ rows: 4 }} />
      <Skeleton active paragraph={{ rows: 4 }} />
      <Skeleton active paragraph={{ rows: 1 }} />
      <Skeleton active paragraph={{ rows: 1 }} />
      <Skeleton active paragraph={{ rows: 1 }} />
      <div style={{ marginTop: "3rem" }} />
      <Skeleton active paragraph={{ rows: 2 }} avatar />
      <Skeleton active paragraph={{ rows: 3 }} avatar />
      <Skeleton active paragraph={{ rows: 2 }} avatar />
    </Layout>
  );
};

export default ApplySkeleton;
