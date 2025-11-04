import { useEffect, useState, useMemo } from "react";
import clsx from "clsx";
import { Button, Input, Badge, Text, Box } from "@mantine/core";
import { Plus, Search } from "lucide-react";
import AddFriend from "./components/AddFriend";
import { useDisclosure } from "@mantine/hooks";
import ChatRoom from "@/components/chat/chat-room";
import { useQuery } from "@tanstack/react-query";
import { getChatList } from "@/service/chat";
import { getValidUid } from "@/api/token";
import chatStore from "@/store/chat";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import UserAvatar from "@/components/public/user_avatar";

export interface IChatInfo {
  chatId: string;
  chatUser: string;
  userName: string;
  online: boolean;
}

const Page = observer(() => {
  const [chatInfo, setChatInfo] = useState<IChatInfo>({
    chatId: "",
    chatUser: "",
    userName: "",
    online: false,
  });
  const [search, setSearch] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [chatOpen, setChatOpen] = useState(false);

  // 获取聊天列表
  const { data } = useQuery({
    queryKey: ["chatList", getValidUid()],
    queryFn: () => getChatList(),
  });

  // 合并服务器数据和本地临时数据
  useEffect(() => {
    if (data?.data?.data) {
      runInAction(() => {
        const serverChats = data.data.data;
        const localTempChats = chatStore.chatlist.filter(
          (chat) => "isTemp" in chat && chat.isTemp
        );
        
        // 合并：服务器数据 + 本地临时数据（如果不在服务器列表中）
        const mergedChats = [...serverChats];
        localTempChats.forEach((tempChat) => {
          if (!mergedChats.find((chat) => chat.userId === tempChat.userId)) {
            mergedChats.unshift(tempChat);
          }
        });
        
        chatStore.chatlist = mergedChats;
      });
    }
  }, [data]);

  // 过滤聊天列表（根据搜索关键词）
  const filteredChatList = useMemo(() => {
    if (!search) return chatStore.chatlist;
    const lowerSearch = search.toLowerCase();
    return chatStore.chatlist.filter(
      (chat) =>
        chat.username.toLowerCase().includes(lowerSearch) ||
        chat.userId.toLowerCase().includes(lowerSearch)
    );
  }, [chatStore.chatlist, search]);

  // 选择聊天
  const handleSelectChat = (userId: string) => {
    const chat = chatStore.chatlist.find((c) => c.userId === userId);
    if (chat) {
      setChatInfo({
        chatId: chat.userId,
        chatUser: chat.userId,
        userName: chat.username,
        online: chat.online,
      });
      setChatOpen(true);
    }
  };

  

  return (
    <div className="bg-[#f7f8fa] px-6 py-4 h-full">
      <div className="w-full flex flex-row overflow-y-auto h-full flex-1 bg-white">
        <div
          className={clsx(
            "flex flex-col w-[450px] h-full overflow-y-scroll border-r",
            {
              "sm:flex hidden": chatOpen,
            }
          )}
        >
          {/* 搜索和添加好友 */}
          <div className="h-[60px] flex items-center px-4 border-b dark:border-[#2C2E33]">
            <div className="flex-1 relative">
              <Input
                placeholder="搜索好友..."
                className="flex-1"
                rightSection={<Search size={16} />}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearch((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </div>
            <Button 
              variant="subtle"
              className="ml-2 px-2 h-[36px] hover:bg-gray-100 dark:hover:bg-[#2C2E33]" 
              onClick={opened ? close : open}
            >
              <Plus size={20} />
            </Button>
          </div>

          <AddFriend
            opened={opened}
            close={close}
            onSelectChat={handleSelectChat}
          />

          {/* 聊天列表 */}
          <div className="flex-1 overflow-y-auto">
            {filteredChatList?.length > 0 ? (
              filteredChatList.map((chat) => {
                const isTemp = "isTemp" in chat && chat.isTemp;
                const isActive = chatInfo.chatId === chat.userId;

                // 格式化最后一条消息
                let lastMessageText = "暂无消息";
                let lastMessageTime = "";
                if (chat.lastMessage) {
                  const message = chat.lastMessage;
                  if (message.messageType === "text") {
                    const content =
                      typeof message.content === "string"
                        ? JSON.parse(message.content).text || message.content
                        : (message.content as any).text || "";
                    lastMessageText = content || "暂无消息";
                  } else if (message.messageType === "image") {
                    lastMessageText = "[图片]";
                  } else if (message.messageType === "audio") {
                    lastMessageText = "[语音]";
                  }
                  lastMessageTime = new Date(message.createdAt).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );
                }

                return (
                  <div
                    key={chat.userId}
                    className={clsx(
                      "flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2C2E33] transition-colors",
                      {
                        "bg-gray-50 dark:bg-[#2C2E33]": isActive,
                      }
                    )}
                    onClick={() => handleSelectChat(chat.userId)}
                  >
                    <div className="relative">
                      <UserAvatar
                        src={chat.avatar || undefined}
                        size="small"
                        disabled={true}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Box className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Text className="text-sm font-medium truncate">
                            {chat.username}
                            {isTemp && (
                              <span className="text-xs text-gray-400 ml-1">
                                (新对话)
                              </span>
                            )}
                          </Text>
                          {lastMessageTime && (
                            <Text size="xs" color="dimmed">
                              {lastMessageTime}
                            </Text>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <Text
                            size="xs"
                            color="dimmed"
                            className="flex-1 truncate"
                          >
                            {lastMessageText}
                          </Text>
                          {!isTemp && chat.unreadCount > 0 && (
                            <Badge
                              variant="filled"
                              size="sm"
                              className="min-w-[20px] h-[20px]"
                            >
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </Box>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Text size="sm">
                  {search ? "未找到匹配的聊天" : "暂无聊天"}
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* 聊天窗口 */}
        {chatOpen ? (
          <ChatRoom
            key={chatInfo.chatId}
            className={clsx("w-full")}
            chatInfo={chatInfo}
            setOpen={setChatOpen}
          />
        ) : (
          <div className="hidden sm:flex flex-col flex-grow items-center justify-center text-gray-400">
            <Text size="sm">选择一个聊天开始会话</Text>
          </div>
        )}
      </div>
    </div>
  );
})

export default Page