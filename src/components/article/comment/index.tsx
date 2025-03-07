import { Button, Card, Input } from "@mantine/core";
import CommentCard from "./comment-card";
import { FC, useState } from "react";
import { postComment } from "@/service/article";
import { IPostCommentData } from "@/types/article";
import { getValidUid } from "@/api/token";
import clsx from "clsx";
import { toastMessage } from "@/components/toast";

interface IProps {
  commentId: string;
  content: string;
  className?: string;
}

export interface IComment {
  userInfoId: string;
  content: string;
  createdAt: string; // ISOString
}

const CommentBox: FC<IProps> = ({ commentId, content, className }) => {
  const [comments, setComments] = useState<IComment[]>(JSON.parse(content));
  const [newComment, setNewComment] = useState<string>("");
  function handlePostComment() {
    const data: IPostCommentData = {
      commentId,
      content: newComment,
      createdAt: new Date().toISOString(),
    };
    postComment(data).then(() => {
      setComments((prev) => {
        if (!prev)
          return [
            {
              userInfoId: getValidUid() as string,
              content: newComment,
              createdAt: new Date().toISOString(),
            },
          ];
        else
          return [
            ...prev,
            {
              userInfoId: getValidUid() as string,
              content: newComment,
              createdAt: new Date().toISOString(),
            },
          ];
      });
      toastMessage.success("评论发布成功");
    });
    setNewComment("");
  }
  return (
    <Card className={clsx(className, " mt-8 rounded-lg")}>
      <div className="flex gap-2">
        <Input
          placeholder="Write a comment..."
          size="md"
          className="flex-1"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handlePostComment();
            }
          }}
        />
        <Button
          variant="outline"
          size="md"
          className="text-theme_blue"
          onClick={handlePostComment}
        >
          发布
        </Button>
      </div>
      <div className="flex flex-col gap-4 mt-2">
        {!comments && (
          <div className="w-full h-[100px] text-center font-bold text-xl translate-y-[40%] ">
            暂无评论
          </div>
        )}
        {comments &&
          comments.map((comment) => {
            return (
              <CommentCard
                comment={comment}
                key={comment.userInfoId}
                createdAt={comment.createdAt}
                className="w-full"
              />
            );
          })}
      </div>
    </Card>
  );
};

export default CommentBox;
