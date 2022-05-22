import React from "react";
import { Table, Tag, Progress } from "antd";
import styled from "styled-components";
import { useRouter } from "next/router";

const StyledTable = styled(Table)`
  .apply-row {
    cursor: pointer;
  }

  .score-column {
    padding: 0;
  }
`;

const columns = [
  {
    title: "Nom",
    width: 300,
    dataIndex: "name",
    sorter: (a, b) => {
      if (a.name < b.name) return -1;
      else if (a.name > b.name) return 1;
      else return 0;
    },
  },
  {
    title: "Date",
    width: 200,
    align: "center",
    dataIndex: "date",
    responsive: ["md"],
    sorter: (a, b) => a.date - b.date,
    render: (elt) => {
      const date = new Date(elt);

      return date.toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    title: "Commentaires",
    dataIndex: "comments",
    width: 20,
    align: "center",
  },
  {
    title: "Votes",
    dataIndex: "votes",
    className: "score-column",
    align: "center",
    responsive: ["lg"],
    render: (data) => {
      const percentage = Math.floor((data.score / data.size) * 100);
      return (
        <Progress
          gapDegree={140}
          type="dashboard"
          percent={percentage}
          width={50}
          style={{ paddingTop: "10px" }}
          success={{ percent: 0 }}
          format={(percent) => (
            <div style={{ paddingTop: "7px" }}>
              {percent}%<br />
              {data.size} votes
            </div>
          )}
          strokeColor={percentage <= 50 ? "#ffa39e" : "#b7eb8f"}
        />
      );
    },
  },
  {
    title: "Etat",
    dataIndex: "status",
    align: "center",
    sorter: (a, b) => {
      if (a.status < b.status) return -1;
      else if (a.status > b.status) return 1;
      else return 0;
    },
    onFilter: (value, record) => {
      return record.status === value;
    },
    filters: [
      {
        text: "En Test",
        value: "test",
      },
      {
        text: "En Attente",
        value: "pending",
      },
      {
        text: "Accepté",
        value: "accept",
      },
      {
        text: "Refusé",
        value: "reject",
      },
    ],
    render: (status) => statusToTag(status),
  },
];

const statusToTag = (status: string) => {
  switch (status) {
    case "accept":
      return <Tag color="success">Accepté</Tag>;
    case "reject":
      return <Tag color="error">Refusé</Tag>;
    case "test":
      return <Tag color="processing">En Test</Tag>;
    case "pending":
      return <Tag>En Attente</Tag>;
    default:
      return <Tag>En Attente</Tag>;
  }
};

const ApplyTable = ({ data }) => {
  const router = useRouter();

  const applies = data.map((elt) => ({
    date: new Date(elt.date).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    ...elt,
  }));

  return (
    <StyledTable
      dataSource={applies}
      columns={columns}
      onRow={(record, rowIndex) => {
        return {
          onClick: () => {
            router.push(`/apply/${record.id}`);
          },
        };
      }}
      rowClassName="apply-row"
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "15", "20", "30", "50"],
      }}
    />
  );
};

export default ApplyTable;
