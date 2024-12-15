import { Avatar, Group, Text, TextInput } from "@mantine/core";
import { FC } from "react";
import { IComment } from ".";
import { apiConfig } from "@/config";
import clsx from "clsx";

interface IProps {
  comment: IComment;
  className?: string;
}

const CommentCard: FC<IProps> = ({ comment, className }) => {
  return (
    <div
      className={clsx(
        "dark:text-white flex flex-row flex-nowrap gap-4 items-center p-4 border-b border-gray-200 dark:border-gray-700",
        className
      )}
    >
      <Avatar
        src={
          apiConfig.baseUrl + "/uploads/avatars/" + comment.userInfoId + ".png"
        }
        size={40}
        radius="xl"
      />
      <div className="w-full bg-theme_gray dark:bg-theme_gray/30 rounded-md p-2 flex flex-col gap-3 truncate ">
        <div className="line-clamp-3 ">{comment.content}</div>
      </div>
    </div>
  );
};

export default CommentCard;
