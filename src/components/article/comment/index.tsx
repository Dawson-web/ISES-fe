import { Button, Card, Input } from "@mantine/core";
import CommentCard from "./comment-card";
import { FC, useState } from "react";
import { postComment } from "@/service/article";
import { IPostCommentData } from "@/types/article";
import { getUserInfo } from "@/service/user";
import { getValidUid } from "@/api/token";
import { toast } from "sonner";

interface IProps {
  commentId: string;
  content: string;
}

export interface IComment {
  userInfoId: string;
  content: string;
}

const CommentBox: FC<IProps> = ({ commentId, content }) => {
  const [comments, setComments] = useState<IComment[]>(JSON.parse(content));
  const [newComment, setNewComment] = useState<string>("");
  function handlePostComment() {
    const data: IPostCommentData = {
      commentId,
      content: newComment,
    };
    postComment(data).then(() => {
      setComments((prev) => {
        return [
          ...prev,
          {
            userInfoId: getValidUid() as string,
            content: newComment,
          },
        ];
      });
      toast.success("评论发布成功");
    });
    setNewComment("");
  }
  console.log(comments[0]);
  return (
    <Card className="border-2 dark:bg-theme_dark dark:border-gray-600 mt-8 rounded-lg">
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
        {comments.map((comment) => {
          return (
            <CommentCard
              comment={comment}
              key={comment.userInfoId}
              className="w-full"
            />
          );
        })}
      </div>
    </Card>
  );
};

export default CommentBox;
