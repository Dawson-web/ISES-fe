import ChatRoom from "@/components/chat/chat-room";

import { useEffect, useState } from "react";
import { getChatList } from "@/service/chat";
import { getValidUid } from "@/api/token";
import { useQuery } from "@tanstack/react-query";
import FriendCard from "@/components/chat/friend_card";
import { apiConfig } from "@/config";
import clsx from "clsx";
import { Card, Input } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import { IGetChatListResponse } from "@/types/chat";

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
  const [search, setSearch] = useState("");
  const [params] = useSearchParams();
  const [open, setOpen] = useState(false);
  const { isSuccess, data } = useQuery({
    queryKey: ["chatList"],
    queryFn: () => getChatList({ userInfoId: getValidUid() as string }),
  });
  useEffect(() => {
    if (params.get("id") && isSuccess) {
      const chat = data.data.data.find(
        (chat) => chat.id === params.get("id")
      ) as IGetChatListResponse;
      setChatInfo({
        chatId: chat.id,
        chatUser: chat.userInfoId,
        userName: chat.username,
        online: chat.online as number,
      });
      setOpen(true);
    }
  }, []);

  return (
    <div className="w-full flex  bg-white dark:bg-theme_dark overflow-y-auto h-full rounded-lg">
      <div
        className={clsx(
          "flex flex-col sm:gap-0 gap-2 sm:shadow-lg w-full sm:w-[35%] h-full overflow-y-scroll ",
          {
            "sm:flex hidden ": open,
          }
        )}
      >
        <div className="text-sm font-bold p-4 h-[60px] ">
          {/* 好友列表 */}
          <Input
            placeholder="搜索好友(Enter)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch((e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>
        {isSuccess &&
          data.data.data &&
          data.data.data
            .filter((chat) => {
              return chat.username.includes(search);
            })
            .map((chat) => {
              return (
                <FriendCard
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
                    "mx-auto w-full p-2 dark:bg-theme_dark  dark:text-theme_gray border-transparent  h-[80px]   ",
                    {
                      "!bg-theme_gray/10 dark:text-white":
                        chatInfo.chatId === chat.id && open,
                    }
                  )}
                />
              );
            })}
      </div>
      {open ? (
        <ChatRoom
          key={chatInfo.chatId}
          className={clsx("w-full h-[90vh]")}
          chatInfo={chatInfo}
          setOpen={setOpen}
        />
      ) : (
        <Card
          className={clsx(
            "hidden sm:flex flex-col flex-grow justify-start dark:bg-theme_dark dark:text-white p-0 rounded-none w-full h-[90vh] border-l-0  sm:border-l-2 border-gray-200 dark:border-gray-600 "
          )}
        >
          <div className="border-b-2 border-gray-200 dark:border-gray-600 flex items-center justify-between h-[60px] flex-shrink-0 "></div>
          <div className="border-b-2 border-gray-200 dark:border-gray-600 flex-1  flex items-center justify-center text-gray-600">
            暂未选择聊天窗
          </div>

          <div className="flex flex-col flex-shrink-0 h-[160px]">
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
