import { FC, useMemo, useState } from "react";
import { Avatar } from "@arco-design/web-react";
import { Button, Input } from "@mantine/core";
import { MessageSquareReply, PencilLine, Send, Trash2, X } from "lucide-react";
import clsx from "clsx";

import { IComment } from "@/types/article";
import { apiConfig } from "@/config";

interface IProps {
  comment: IComment;
  currentUserId?: string;
  className?: string;
  level?: number;
  onReply: (commentId: string, content: string) => Promise<any>;
  onEdit: (commentId: string, content: string) => Promise<any>;
  onDelete: (commentId: string) => Promise<any>;
}

const resolveCommentContent = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
};

const CommentCard: FC<IProps> = ({
  comment,
  currentUserId,
  className,
  level = 0,
  onReply,
  onEdit,
  onDelete,
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(resolveCommentContent(comment.content));
  const [submittingReply, setSubmittingReply] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = currentUserId === comment.userInfoId;
  const displayContent = useMemo(
    () => resolveCommentContent(comment.content),
    [comment.content]
  );
  const avatarSrc = comment.author?.avatar
    ? `${apiConfig.baseUrl}${comment.author.avatar}`
    : `${apiConfig.baseUrl}/uploads/avatars/${comment.userInfoId}.png`;

  const handleReplySubmit = async () => {
    const content = replyValue.trim();
    if (!content) return;
    setSubmittingReply(true);
    try {
      await onReply(comment.id, content);
      setReplyValue("");
      setShowReplyBox(false);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleEditSubmit = async () => {
    const content = editValue.trim();
    if (!content || content === displayContent) {
      setEditing(false);
      setEditValue(displayContent);
      return;
    }
    setSubmittingEdit(true);
    try {
      await onEdit(comment.id, content);
      setEditing(false);
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("确认删除这条评论？其回复也会一并删除。")) {
      return;
    }
    setDeleting(true);
    try {
      await onDelete(comment.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={clsx(
        "rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800",
        level > 0 && "ml-6 mt-3",
        className
      )}
    >
      <div className="flex gap-3">
        <Avatar className="border border-gray-100 dark:border-gray-700">
          <img alt="avatar" src={avatarSrc} className="object-cover" />
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {comment.author?.username || "匿名用户"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {comment.createdAt?.toString().replace("T", " ").slice(0, 16)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                onClick={() => setShowReplyBox((prev) => !prev)}
              >
                <MessageSquareReply size={14} />
                回复
              </button>
              {isOwner && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                  onClick={() => {
                    setEditing((prev) => !prev);
                    setEditValue(displayContent);
                  }}
                >
                  <PencilLine size={14} />
                  编辑
                </button>
              )}
              {isOwner && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 size={14} />
                  删除
                </button>
              )}
            </div>
          </div>

          <div className="mt-3">
            {editing ? (
              <div className="space-y-2">
                <Input
                  value={editValue}
                  onChange={(event) => setEditValue(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleEditSubmit();
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="xs"
                    loading={submittingEdit}
                    onClick={handleEditSubmit}
                    disabled={!editValue.trim()}
                  >
                    保存
                  </Button>
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => {
                      setEditing(false);
                      setEditValue(displayContent);
                    }}
                  >
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-300">
                {displayContent}
              </div>
            )}
          </div>

          {showReplyBox && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/40">
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder={`回复 ${comment.author?.username || "该用户"}...`}
                  value={replyValue}
                  onChange={(event) => setReplyValue(event.currentTarget.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleReplySubmit();
                    }
                  }}
                />
                <Button
                  size="xs"
                  loading={submittingReply}
                  disabled={!replyValue.trim()}
                  onClick={handleReplySubmit}
                >
                  <Send size={14} />
                </Button>
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={() => {
                    setShowReplyBox(false);
                    setReplyValue("");
                  }}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          )}

          {Array.isArray(comment.replies) && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  level={level + 1}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
