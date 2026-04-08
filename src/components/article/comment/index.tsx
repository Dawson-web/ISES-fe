import { Button, Card, Input } from "@mantine/core";
import CommentCard from "./comment-card";
import { FC, useState } from "react";
import clsx from "clsx";
import { IComment, ICommentForm } from "@/types/article";

interface IProps {
  articleId: string;
  comments: IComment[];
  currentUserId?: string;
  className?: string;
  onSubmitComment: (data: ICommentForm) => Promise<any>;
  onEditComment: (commentId: string, content: string) => Promise<any>;
  onDeleteComment: (commentId: string) => Promise<any>;
}

const CommentBox: FC<IProps> = ({
  articleId,
  comments,
  currentUserId,
  className,
  onSubmitComment,
  onEditComment,
  onDeleteComment,
}) => {
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
  };

  const handleReplyComment = async (commentId: string, content: string) => {
    await onSubmitComment({
      targetId: commentId,
      targetType: "comment",
      content,
    });
  };

  return (
    <Card className={clsx(className, "mt-8 rounded-xl shadow-sm bg-white dark:bg-gray-800 border-0")}>
      <div className="flex gap-3">
        <Input
          placeholder="写下你的评论..."
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
          // variant="filled"
          disabled={!newComment.trim()}
          className=""
          onClick={handlePostComment}
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
                key={comment.id}
                currentUserId={currentUserId}
                onReply={handleReplyComment}
                onEdit={onEditComment}
                onDelete={onDeleteComment}
                className="w-full"
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
