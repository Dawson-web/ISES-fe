import { Avatar } from "@mantine/core";
import { FC } from "react";
import { IComment } from ".";
import { apiConfig } from "@/config";
import clsx from "clsx";

interface IProps {
  comment: IComment;
  className?: string;
  createdAt: string;
}

const CommentCard: FC<IProps> = ({ comment, className, createdAt }) => {
  return (
    <div className=" border-b border-gray-200 dark:border-gray-700 p-4">
      <div
        className={clsx(
          "dark: flex flex-row flex-nowrap gap-4 items-center ",
          className
        )}
      >
        <Avatar
          src={
            apiConfig.baseUrl +
            "/uploads/avatars/" +
            comment.userInfoId +
            ".png"
          }
          size={40}
          radius="xl"
        />
        <div className="w-full bg-theme_gray/50 rounded-md p-2 flex flex-col gap-3 truncate ">
          <div className="line-clamp-3 ">{comment.content}</div>
        </div>
      </div>
      <div className="text-sm  absolute ring-0 bottom-0 right-0 p-4">
        {createdAt?.toString().split("T")[0]}
      </div>
    </div>
  );
};

export default CommentCard;
