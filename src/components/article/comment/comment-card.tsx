
import  {  FC, useState } from 'react';
import { Comment, Avatar } from '@arco-design/web-react';
import {
  IconHeartFill,
  IconStarFill,
  IconHeart,
  IconStar,
} from '@arco-design/web-react/icon';
import { IComment } from "@/types/article";
import { apiConfig } from "@/config";
import clsx from "clsx";

interface IProps {
  comment: IComment;
  className?: string;
  createdAt: string;
}

const CommentCard: FC<IProps> = ({ comment, className, createdAt }) => {
  const [like, setLike] = useState(false);
  const [star, setStar] = useState(false);

  const actions = [
    <button 
      className="px-2 py-1 leading-6 rounded-full transition-all duration-200 text-gray-700 dark:text-gray-300 cursor-pointer inline-flex items-center gap-1 border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-blue-500" 
      key='heart' 
      onClick={() => setLike(!like)}
    >
      {like ? (
        <IconHeartFill className="text-red-500" style={{ fontSize: '16px' }}/>
      ) : (
        <IconHeart style={{ fontSize: '16px' }}/>
      )}
      <span className="text-sm">{83 + (like ? 1 : 0)}</span>
    </button>,
    <button 
      className="px-2 py-1 leading-6 rounded-full transition-all duration-200 text-gray-700 dark:text-gray-300 cursor-pointer inline-flex items-center gap-1 border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-blue-500" 
      key='star' 
      onClick={() => setStar(!star)}
    >
      {star ? (
        <IconStarFill className="text-yellow-500" style={{ fontSize: '16px' }}/>
      ) : (
        <IconStar style={{ fontSize: '16px' }}/>
      )}
      <span className="text-sm">{3 + (star ? 1 : 0)}</span>
    </button>,
  ];

  return (
    <div className={clsx("border-b border-gray-100 dark:border-gray-700", className)}>
      <Comment
        actions={actions}
        align='right'
        author={<span className="font-medium text-gray-900 dark:text-gray-100">{comment.author.username}</span>}
        avatar={
          <Avatar className="border-2 border-gray-100 dark:border-gray-700">
            <img
              alt='avatar'
              src={`${apiConfig.baseUrl}/uploads/avatars/${comment.userInfoId}.png`}
              className="object-cover"
            />
          </Avatar>
        }
        content={
          <div className="text-gray-700 dark:text-gray-300 mt-1">
            {comment.content}
          </div>
        }
        datetime={
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {createdAt?.toString().split("T")[0]}
          </span>
        }
      />
    </div>
  );
};

export default CommentCard;
