import ChatRoom from "@/components/chat/chat-room";

import { useEffect, useState } from "react";
import { getChatList } from "@/service/chat";
import { getValidUid } from "@/api/token";
import { useQuery } from "@tanstack/react-query";
import FriendCard from "@/components/chat/friend_card";
import { apiConfig } from "@/config";
import clsx from "clsx";
import { Button, Card, Input } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import { IGetChatListResponse } from "@/types/chat";
import { Plus } from "lucide-react";
import AddFriend from "./components/AddFriend";
import { useDisclosure } from "@mantine/hooks";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false);

  const [chatOpen, setChatOpen] = useState(false);
  const { isSuccess, data } = useQuery({
    queryKey: ["chatList"],
    queryFn: () => getChatList({ userInfoId: getValidUid() as string }),
  });
  useEffect(() => {
    if (searchParams.get("id") && isSuccess) {
      const chat = data.data.data.find(
        (chat) => chat.id === searchParams.get("id")
      ) as IGetChatListResponse;
      setChatInfo({
        chatId: chat.id,
        chatUser: chat.userInfoId,
        userName: chat.username,
        online: chat.online as number,
      });
      setChatOpen(true);
    }
  }, []);

  return (
    <Card className="w-full flex flex-row p-0 overflow-y-auto h-full rounded-lg flex-1">
      <div
        className={clsx(
          "flex flex-col sm:gap-0 gap-2 sm:shadow-lg w-full sm:w-[35%] h-full overflow-y-scroll ",
          {
            "sm:flex hidden ": chatOpen,
          }
        )}
      >
        <div className="text-sm font-bold p-4 h-[60px] flex items-center justify-between gap-2">
          {/* 好友列表 */}
          <Input
            placeholder="搜索好友(Enter)"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch((e.target as HTMLInputElement).value);
              }
            }}
          />
          <Button className="px-1 scale-90" onClick={opened ? close : open}>
            <Plus />
          </Button>
        </div>
        <AddFriend opened={opened} close={close} />
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
                    searchParams.set("id", chat.id);
                    setChatOpen(true);
                  }}
                  className={clsx(
                    "mx-auto w-full p-2   dark:text-theme_gray border-transparent  h-[80px]   ",
                    {
                      "!bg-theme_gray/10 dark:":
                        chatInfo.chatId === chat.id && open,
                    }
                  )}
                />
              );
            })}
      </div>
      {chatOpen ? (
        <ChatRoom
          key={chatInfo.chatId}
          className={clsx("w-full ")}
          chatInfo={chatInfo}
          setOpen={setChatOpen}
        />
      ) : (
        <Card
          className={clsx(
            "hidden sm:flex flex-col flex-grow justify-start  dark: p-0 rounded-none w-full border-0  "
          )}
        >
          <Card className=" flex items-center justify-between  flex-shrink-0  rounded-none h-[70px]"></Card>
          <Card className=" flex-1  flex items-center justify-center text-gray-600 rounded-none ">
            暂未选择聊天窗
          </Card>

          <Card className="flex flex-col flex-shrink-0 h-[160px]">
            <textarea
              disabled
              className="w-full h-full p-3 bg-transparent outline-none resize-none bg-h-full focus-visible:outline-none border-box-border"
            />
          </Card>
        </Card>
      )}
    </Card>
  );
}
