import { Card, Textarea } from "@mantine/core";
import clsx from "clsx";
import { Undo2 } from "lucide-react";
import { FC } from "react";
import MessageList from "./MessageList";

interface Props {
  className?: string;
  chat: string;
}
const ChatRoom: FC<Props> = ({ className, chat }) => {
  return (
    <Card
      className={clsx(
        "flex-grow flex flex-col gap-1 justify-evenly dark:bg-theme_dark dark:text-white p-0",
        className
      )}
    >
      <div className="border-b-2 border-gray-200 dark:border-gray-600  flex items-center justify-end p-2">
        <Undo2 className="text-gray-600 dark:text-white " />
      </div>
      <MessageList className="border-b-2 border-gray-200 dark:border-gray-600 min-h-[50vh]" />
      <div className="flex flex-col h-full">
        <textarea
          //   value={content}
          //   onChange={(e) => setContent(e.target.value)}
          //   onKeyDown={handleSend}
          className="w-full h-full p-3 bg-transparent outline-none resize-none bg-h-full focus-visible:outline-none border-box-border"
        />
        <p className="p-3 text-sm text-right text-default-500">
          按 Enter 发送消息
        </p>
      </div>
    </Card>
  );
};

export default ChatRoom;
