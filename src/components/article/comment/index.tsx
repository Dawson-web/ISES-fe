

import { Button, Card, Input } from "@mantine/core";
import CommentCard from "./comment-card";
import { FC, useState } from "react";
import clsx from "clsx";
import { IComment, ICommentForm } from "@/types/article";

interface IProps {
  articleId: string;
  comments: IComment[];
  className?: string;
  onSubmitComment: (data: ICommentForm) => Promise<any>;
}

const CommentBox: FC<IProps> = ({ articleId, comments, className, onSubmitComment }) => {
  const [newComment, setNewComment] = useState<string>("");
  
  const handlePostComment = async() => {
    if (!newComment.trim()) return;
    const data: ICommentForm = {
      targetId: articleId,
      targetType: "content",
      content: newComment,
    };
    await onSubmitComment(data)
    setNewComment("");
  }
  return (
    <Card className={clsx(className, "mt-8 rounded-xl shadow-sm bg-white dark:bg-gray-800")}>
      <div className="flex gap-3">
        <Input
          placeholder="写下你的评论..."
          size="md"
          className="flex-1 transition-all duration-200 hover:border-blue-400 focus:border-blue-500"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handlePostComment();
            }
          }}
        />
        <Button
          variant="filled"
          size="md"
          className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
          onClick={handlePostComment}
          disabled={!newComment.trim()}
        >
          评论
        </Button>
      </div>
      <div className="flex flex-col gap-6 mt-6">
        {comments && comments.length > 0 ?
          comments.map((comment) => {
            return (
              <CommentCard
                comment={comment}
                key={comment.userInfoId}
                createdAt={comment.createdAt}
                className="w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 p-2 rounded-lg"
              />
            );
          }):
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">暂无评论，来发表第一条评论吧~</div>
        }
      </div>
    </Card>
  );
};

export default CommentBox;
