import clsx from "clsx";
import { FC } from "react";
import MessageItem from "./MessageItem";

interface Props {
  className?: string;
}
const MessageList: FC<Props> = ({ className }) => {
  return (
    <div className={clsx("flex flex-col gap-2 p-4", className)}>
      <MessageItem />
      <MessageItem />
    </div>
  );
};

export default MessageList;
