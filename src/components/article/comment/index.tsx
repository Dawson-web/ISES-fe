import React, { FC, useState } from 'react';
import { Comment, Avatar } from '@arco-design/web-react';
import {
  IconHeartFill,
  IconMessage,
  IconStarFill,
  IconHeart,
  IconStar,
} from '@arco-design/web-react/icon';
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
  likes?: number;
  stars?: number;
}

const CommentBox: FC<IProps> = ({ commentId, content, className }) => {
  const [comments, setComments] = useState<IComment[]>(JSON.parse(content));
  const [newComment, setNewComment] = useState<string>("");
  const [likeStates, setLikeStates] = useState<{[key: string]: boolean}>({});
  const [starStates, setStarStates] = useState<{[key: string]: boolean}>({});

  function handlePostComment() {
    if (!newComment.trim()) {
      toastMessage.error("评论内容不能为空");
      return;
    }

    const newCommentObj = {
      userInfoId: getValidUid() as string,
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      stars: 0
    };

    setComments(prev => prev ? [...prev, newCommentObj] : [newCommentObj]);
    setNewComment("");
    toastMessage.success("评论发布成功");
  }

  const renderActions = (comment: IComment) => {
    const isLiked = likeStates[comment.userInfoId] || false;
    const isStarred = starStates[comment.userInfoId] || false;
    
    return [
      <button 
        className='custom-comment-action flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors' 
        key='heart' 
        onClick={() => {
          setLikeStates(prev => ({
            ...prev,
            [comment.userInfoId]: !isLiked
          }));
        }}
      >
        {isLiked ? (
          <IconHeartFill className="text-red-500" />
        ) : (
          <IconHeart />
        )}
        <span>{(comment.likes || 0) + (isLiked ? 1 : 0)}</span>
      </button>,
      <button 
        className='custom-comment-action flex items-center gap-1 text-gray-600 hover:text-yellow-500 transition-colors' 
        key='star' 
        onClick={() => {
          setStarStates(prev => ({
            ...prev,
            [comment.userInfoId]: !isStarred
          }));
        }}
      >
        {isStarred ? (
          <IconStarFill className="text-yellow-500" />
        ) : (
          <IconStar />
        )}
        <span>{(comment.stars || 0) + (isStarred ? 1 : 0)}</span>
      </button>,
      // <button className='custom-comment-action flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors' key='reply'>
      //   <IconMessage /> 回复
      // </button>,
    ];
  };

  return (
    <div className={clsx("mt-8 space-y-4", className)}>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="写下你的评论..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handlePostComment();
            }
          }}
        />
        <button
          className="px-6 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
          onClick={handlePostComment}
        >
          发布
        </button>
      </div>
      
      <div className="space-y-4">
        {!comments || comments.length === 0 ? (
          <div className="w-full h-[100px] text-center font-bold text-xl text-gray-500 flex items-center justify-center">
            暂无评论
          </div>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.userInfoId}
              actions={renderActions(comment)}
              author={`用户 ${comment.userInfoId.slice(0, 8)}`}
              avatar={
                <Avatar>
                  <img
                    alt='avatar'
                    src={`//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/9eeb1800d9b78349b24682c3518ac4a3.png~tplv-uwbnlip3yd-webp.webp`}
                  />
                </Avatar>
              }
              content={comment.content}
              datetime={new Date(comment.createdAt).toLocaleString()}
              className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentBox;
