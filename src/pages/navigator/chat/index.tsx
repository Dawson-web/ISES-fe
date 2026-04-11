import { useEffect, useState, useCallback } from "react";
import clsx from "clsx";
import { Button, Input, Badge, Text, Box } from "@mantine/core";
import { Plus, Search } from "lucide-react";
import AddFriend from "./components/AddFriend";
import { useDisclosure } from "@mantine/hooks";
import ChatRoom from "@/components/chat/chat-room";
import { useQuery } from "@tanstack/react-query";
import { getChatList } from "@/service/chat";
import { getUserInfoApi } from "@/service/user";
import { getValidUid } from "@/api/token";
import chatStore from "@/store/chat";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import UserAvatar from "@/components/public/user_avatar";
import { useNavigate, useSearchParams } from "react-router-dom";

export interface IChatInfo {
  chatId: string;
  chatUser: string;
  userName: string;
  online: boolean;
}

const getTextMessagePreview = (
  content: string | Record<string, unknown>
): string => {
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content) as { text?: unknown };
      if (typeof parsed?.text === "string") {
        return parsed.text;
      }
    } catch {
      return content;
    }
    return content;
  }

  return typeof content.text === "string" ? content.text : "";
};

const Page = observer(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [chatInfo, setChatInfo] = useState<IChatInfo>({
    chatId: "",
    chatUser: "",
    userName: "",
    online: false,
  });
  const [search, setSearch] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [handledRouteUserId, setHandledRouteUserId] = useState("");

  const routeUserId = (searchParams.get("userId") || "").trim();
  const routeUsername = (searchParams.get("username") || "").trim();

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
  const filteredChatList = !search
    ? chatStore.chatlist
    : chatStore.chatlist.filter((chat) => {
        const lowerSearch = search.toLowerCase();
        return (
          chat.username.toLowerCase().includes(lowerSearch) ||
          chat.userId.toLowerCase().includes(lowerSearch)
        );
      });

  const openOrCreateChat = useCallback(
    (targetUser: {
      id: string;
      username?: string | null;
      avatar?: string | null;
      introduce?: string | null;
      school?: string | null;
      online?: boolean;
    }) => {
      if (!targetUser.id) {
        return;
      }

      const existingChat = chatStore.chatlist.find(
        (chat) => chat.userId === targetUser.id
      );

      if (!existingChat) {
        chatStore.addTempChatItem({
          userId: targetUser.id,
          username: targetUser.username || "这个人很懒未留名",
          avatar: targetUser.avatar || null,
          introduce: targetUser.introduce || null,
          school: targetUser.school || null,
          online: targetUser.online || false,
          lastMessage: null,
          unreadCount: 0,
          isTemp: true,
        });
      }

      const selectedChat = chatStore.chatlist.find(
        (chat) => chat.userId === targetUser.id
      );
      setChatInfo({
        chatId: targetUser.id,
        chatUser: targetUser.id,
        userName: selectedChat?.username || targetUser.username || "这个人很懒未留名",
        online: selectedChat?.online ?? !!targetUser.online,
      });
      setChatOpen(true);
    },
    []
  );

  const handleViewProfile = useCallback(
    (userId: string) => {
      if (!userId) {
        return;
      }

      navigate(`/navigator/profile?id=${userId}`);
    },
    [navigate]
  );

  // 选择聊天
  const handleSelectChat = useCallback(
    (userId: string) => {
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
    },
    []
  );

  useEffect(() => {
    if (!routeUserId || routeUserId === handledRouteUserId) {
      return;
    }

    if (routeUserId === getValidUid()) {
      setHandledRouteUserId(routeUserId);
      return;
    }

    let cancelled = false;

    const openChatFromRoute = async () => {
      const existingChat = chatStore.chatlist.find(
        (chat) => chat.userId === routeUserId
      );

      if (existingChat) {
        handleSelectChat(routeUserId);
        if (!cancelled) {
          setHandledRouteUserId(routeUserId);
        }
        return;
      }

      if (routeUsername) {
        openOrCreateChat({
          id: routeUserId,
          username: routeUsername,
        });
        if (!cancelled) {
          setHandledRouteUserId(routeUserId);
        }
        return;
      }

      try {
        const res = await getUserInfoApi(routeUserId);
        if (cancelled) {
          return;
        }

        const targetUser = res.data.data;
        openOrCreateChat({
          id: targetUser.id,
          username: targetUser.username,
          avatar: targetUser.avatar || null,
          introduce: targetUser.introduce || null,
          school: targetUser.school || null,
          online: targetUser.online,
        });
      } catch (error) {
        console.error("打开私信会话失败:", error);
      } finally {
        if (!cancelled) {
          setHandledRouteUserId(routeUserId);
        }
      }
    };

    openChatFromRoute();

    return () => {
      cancelled = true;
    };
  }, [
    handleSelectChat,
    handledRouteUserId,
    openOrCreateChat,
    routeUserId,
    routeUsername,
  ]);


  return (
    <div className="bg-page sm:px-6 sm:py-4 h-full">
      <div className="w-full flex flex-row overflow-y-auto h-full bg-white shadow-card rounded-xl overflow-hidden">
        <div
          className={clsx(
            "flex flex-col h-full overflow-y-scroll border-r",
            // sm 以上：始终显示，宽度 30%
            "md:w-[30%] md:flex w-full",
            // sm 以下：根据 chatOpen 状态显示/隐藏，宽度 100%
            {
              "hidden": chatOpen, // sm 以下且 chatOpen 时隐藏
              "flex": !chatOpen, // sm 以下且 !chatOpen 时显示
            }
          )}
        >
          {/* 搜索和添加好友 */}
          <div className="h-[71px] flex items-center px-4 border-b dark:border-[#2C2E33]">
            <div className="flex-1 relative">
              <Input
                placeholder="搜索好友..."
                className="flex-1"
                value={search}
                rightSection={<Search size={16} />}
                onChange={(e) => {
                  setSearch(e.currentTarget.value);
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
                    const content = getTextMessagePreview(message.content);
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
                    <button
                      type="button"
                      className="relative shrink-0 bg-transparent border-0 p-0 cursor-pointer"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleViewProfile(chat.userId);
                      }}
                    >
                      <UserAvatar
                        src={chat.avatar || undefined}
                        size="small"
                        disabled={true}
                      />
                    </button>

                    <div className="min-w-0">
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
            className={clsx(
              // sm 以上：宽度 70%
              "md:w-[70%]",
              // sm 以下：宽度 100%
              "w-full"
            )}
            chatInfo={chatInfo}
            setOpen={setChatOpen}
          />
        ) : (
          <div className="flex-1 hidden md:flex flex-col flex-grow items-center justify-center text-gray-400">
            <Text size="sm">选择一个聊天开始会话</Text>
          </div>
        )}
      </div>
    </div>
  );
})

export default Page
