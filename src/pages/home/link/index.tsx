import ChatRoom from "@/components/chat-room";

import { useState } from "react";
import { getChatList } from "@/service/chat";
import { getValidUid } from "@/api/token";
import { useQuery } from "@tanstack/react-query";
import LinkCard from "@/components/link_card";
import { apiConfig } from "@/config";
import clsx from "clsx";
import { Card } from "@mantine/core";

export interface IChatInfo {
  chatId: string;
  chatUser: string;
  userName: string;
  online: number;
}

export default function Page() {
  const [chatInfo, setChatInfo] = useState<IChatInfo>({
    chatId: "",
    chatUser: "",
    userName: "",
    online: 0,
  });

  const [open, setOpen] = useState(false);
  const { isSuccess, data } = useQuery({
    queryKey: ["chatList"],
    queryFn: () => getChatList({ userInfoId: getValidUid() as string }),
  });

  return (
    <div className="w-full flex gap-2 bg-white dark:bg-theme_dark overflow-y-auto h-[90vh] rounded-lg">
      <div
        className={clsx(
          "flex flex-col sm:gap-0 gap-2 sm:shadow-lg w-full sm:w-[35%] h-full overflow-y-scroll",
          {
            "sm:flex hidden ": open,
          }
        )}
      >
        {isSuccess &&
          data.data.data.map((chat) => {
            return (
              <LinkCard
                url={`${apiConfig.baseUrl}${chat.avatar}`}
                key={chat.id}
                name={chat.username}
                desc={chat.introduce}
                online={chat.online as number}
                connect={chat.connect}
                chatListId={chat.id}
                temporary={chat.user1 === getValidUid() ? false : true} //判断是否为临时会话,用户1为发起者
                onClick={() => {
                  setChatInfo({
                    chatId: chat.id,
                    chatUser: chat.userInfoId,
                    userName: chat.username,
                    online: chat.online as number,
                  });
                  setOpen(true);
                }}
                className={clsx(
                  "mx-auto w-full p-2 rounded-lg shadow-md bg-white dark:bg-theme_dark border-transparent  border-2  ",
                  { "border-theme_blue": chatInfo.chatId === chat.id && open }
                )}
              />
            );
          })}
      </div>
      {open ? (
        <ChatRoom
          className={clsx("w-full h-[90vh]")}
          chatInfo={chatInfo}
          setOpen={setOpen}
        />
      ) : (
        <Card
          className={clsx(
            "hidden sm:flex flex-col flex-grow justify-start dark:bg-theme_dark dark:text-white p-0 rounded-xl w-full h-[90vh] "
          )}
        >
          <div className="border-b-2 border-gray-200 dark:border-gray-600 flex items-center justify-between h-[10%] "></div>
          <div className="border-b-2 border-gray-200 dark:border-gray-600 h-[65%]  flex items-center justify-center text-gray-600">
            暂未选择聊天窗
          </div>

          <div className="flex flex-col h-[25%]">
            <textarea
              disabled
              className="w-full h-full p-3 bg-transparent outline-none resize-none bg-h-full focus-visible:outline-none border-box-border"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
