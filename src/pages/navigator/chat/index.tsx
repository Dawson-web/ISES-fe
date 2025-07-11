import { useEffect, useState } from "react";
import { getValidUid } from "@/api/token";
import { apiConfig } from "@/config";
import clsx from "clsx";
import { Button, Card, Input, Badge, Avatar, Text, Box } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import AddFriend from "./components/AddFriend";
import { useDisclosure } from "@mantine/hooks";
import ChatRoom from "@/components/chat/chat-room";

interface ILastMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  messageType: string;
  content: string;
  metadata: {
    isRead: boolean;
    isDeleted: boolean;
  };
  replyToId: string | null;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    username: string;
    avatar: string | null;
    introduce: string | null;
    school: string | null;
    online: boolean;
  };
  receiver: {
    id: string;
    username: string;
    avatar: string | null;
    introduce: string | null;
    school: string | null;
    online: boolean;
  };
}

interface IChatListItem {
  userId: string;
  username: string;
  avatar: string | null;
  introduce: string | null;
  school: string | null;
  online: boolean;
  lastMessage: ILastMessage;
  unreadCount: number;
}

export interface IChatInfo {
  chatId: string;
  chatUser: string;
  userName: string;
  online: boolean;
}

// Demo数据
const DEMO_DATA: IChatListItem[] = [
  {
    userId: "aa947e2b-4c3a-494e-88d8-4bdb7143a4ee",
    username: "小黑",
    avatar: null,
    introduce: null,
    school: null,
    online: true,
    lastMessage: {
      id: "1751345028362872289399",
      fromUserId: "242c9423-d78f-41bb-8006-600c234e0f39",
      toUserId: "aa947e2b-4c3a-494e-88d8-4bdb7143a4ee",
      messageType: "text",
      content: '{"text": "string", "imageUrl":"string"}',
      metadata: {
        isRead: true,
        isDeleted: true
      },
      replyToId: null,
      createdAt: "2025-07-01T04:43:48.000Z",
      updatedAt: "2025-07-01T05:01:39.000Z",
      sender: {
        id: "242c9423-d78f-41bb-8006-600c234e0f39",
        username: "Dawson1",
        avatar: null,
        introduce: "卡皮巴拉",
        school: "CUIT",
        online: true
      },
      receiver: {
        id: "aa947e2b-4c3a-494e-88d8-4bdb7143a4ee",
        username: "小黑",
        avatar: null,
        introduce: null,
        school: null,
        online: true
      }
    },
    unreadCount: 0
  }
];

export default function Page() {
  const [chatInfo, setChatInfo] = useState<IChatInfo>({
    chatId: "",
    chatUser: "",
    userName: "",
    online: false,
  });
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const chatId = searchParams.get("id");
    if (chatId) {
      const chat = DEMO_DATA.find(chat => chat.userId === chatId);
      if (chat) {
        setChatInfo({
          chatId: chat.userId,
          chatUser: chat.userId,
          userName: chat.username,
          online: chat.online,
        });
        setChatOpen(true);
      }
    }
  }, [searchParams]);

  const filteredChats = DEMO_DATA.filter(chat => 
    chat.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="w-full flex flex-row p-0 overflow-y-auto h-full rounded-lg flex-1">
      <div
        className={clsx(
          "flex flex-col sm:gap-0 gap-2 sm:shadow-lg w-full sm:w-[35%] h-full overflow-y-scroll border-r dark:border-[#2C2E33]",
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

        <AddFriend opened={opened} close={close} />

        {/* 聊天列表 */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <div
              key={chat.userId}
              className={clsx(
                "flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2C2E33] transition-colors",
                {
                  "bg-gray-50 dark:bg-[#2C2E33]": chatInfo.chatId === chat.userId,
                }
              )}
              onClick={() => {
                setChatInfo({
                  chatId: chat.userId,
                  chatUser: chat.userId,
                  userName: chat.username,
                  online: chat.online,
                });
                setSearchParams({ id: chat.userId });
                setChatOpen(true);
              }}
            >
              <div className="relative">
                <Avatar 
                  src={chat.avatar ? `${apiConfig.baseUrl}${chat.avatar}` : null}
                  alt={chat.username}
                  radius="xl"
                  size="md"
                >
                  {!chat.avatar && chat.username[0]}
                </Avatar>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#1A1B1E]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Box className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Text className="text-sm font-medium truncate">
                      {chat.username}
                    </Text>
                    {chat.lastMessage && (
                      <Text size="xs" color="dimmed">
                        {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Text size="xs" color="dimmed" className="flex-1 truncate">
                      {chat.lastMessage ? (
                        chat.lastMessage.messageType === 'text' ? (
                          JSON.parse(chat.lastMessage.content).text
                        ) : (
                          '[图片]'
                        )
                      ) : '暂无消息'}
                    </Text>
                    {chat.unreadCount > 0 && (
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
          ))}

          {filteredChats.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Text size="sm">暂无聊天</Text>
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
    </Card>
  );
}
