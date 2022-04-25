import React from "react";
import { Comment, Avatar, Tooltip } from "antd";
import sanitizeHtml from "sanitize-html";
import ReactHtmlParser from "react-html-parser";

import { timestampToString, timeSince } from "../utils/time";
import { getAvatarFromName, generateHSL } from "../utils/avatar";

const CommentSection = ({ data }) => {
  const commentList = [];
  const orderedComments = data.sort((a, b) => {
    return a.date - b.date;
  });

  for (const comment of orderedComments) {
    const postTime = timestampToString(comment.date);

    const avatar =
      comment.pp === "NA" ? (
        <Avatar style={{ backgroundColor: generateHSL(comment.author) }}>
          {getAvatarFromName(comment.author)}
        </Avatar>
      ) : (
        <Avatar src={comment.pp} alt={comment.author} />
      );

    commentList.push(
      <Comment
        key={comment.date}
        author={comment.author}
        avatar={avatar}
        content={ReactHtmlParser(sanitizeHtml(comment.content))}
        datetime={
          <Tooltip title={postTime}>
            <span>{timeSince(comment.date)}</span>
          </Tooltip>
        }
      />
    );
  }

  return <>{commentList}</>;
};

export default CommentSection;
