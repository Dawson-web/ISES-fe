import UserAvatar from "@/components/public/user_avatar";
import { searchUsers } from "@/service/user";
import chatStore from "@/store/chat";
import { Button, Card, Input, Modal, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";

interface IProps {
  opened: boolean;
  close: () => void;
  onSelectChat: (userId: string) => void;
}

const AddFriend: FC<IProps> = observer(({ opened, close, onSelectChat }) => {
  const [searchKey, setSearchKey] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { isSuccess, data } = useQuery({
    queryKey: ["searchUser", searchKey],
    queryFn: () => searchUsers({ searchKey }),
    enabled: !!searchKey, // 只在有搜索关键词时查询
  });

  function handleCreateRoom(userInfo: {
    id: string;
    username: string;
    avatar: string | null;
    introduce: string | null;
    school: string | null;
    online?: boolean;
  }) {
    // 检查是否已存在该用户的聊天
    const existingChat = chatStore.chatlist.find(
      (chat) => chat.userId === userInfo.id
    );
    
    if (existingChat) {
      // 如果已存在，直接选择该聊天
      onSelectChat(userInfo.id);
    } else {
      // 添加为临时聊天项（不发送 API 请求）
      chatStore.addTempChatItem({
        userId: userInfo.id,
        username: userInfo.username || "这个人很懒未留名",
        avatar: userInfo.avatar,
        introduce: userInfo.introduce,
        school: userInfo.school,
        online: userInfo.online || false,
        lastMessage: null,
        unreadCount: 0,
        isTemp: true,
      });
      
      // 选择该聊天
      onSelectChat(userInfo.id);
    }
    
    // 重置搜索并关闭弹窗
    setSearchValue("");
    setSearchKey("");
    close();
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      withCloseButton={false}
    >
      <Text className="text-xl font-bold mb-4">查找用户</Text>
      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setSearchKey(searchValue);
          }
        }}
        rightSectionPointerEvents="all"
        rightSection={
          <Button
            className="p-1"
            onClick={() => {
              setSearchKey(searchValue);
            }}
          >
            <SearchIcon />
          </Button>
        }
        placeholder="输入用户名或ID搜索"
      />
      {isSuccess && data?.data?.data?.length ? (
        <div className="flex flex-col gap-2 mt-2 max-h-[400px] overflow-y-auto">
          {data.data.data.map((userInfo) => {
            return (
              <Card className="p-2 relative" key={userInfo.id}>
                <div className="flex items-center gap-4">
                  <UserAvatar
                    src={userInfo.avatar}
                    size="small"
                    disabled={true}
                  />
                  <div className="flex-1">
                    <div className="text-lg font-bold">
                      {userInfo.username || "这个人很懒未留名"}
                    </div>
                    {userInfo.introduce && (
                      <div className="text-sm text-gray-500 truncate">
                        {userInfo.introduce}
                      </div>
                    )}
                  </div>
                  <div
                    className="text-theme_blue cursor-pointer hover:text-theme_blue/80 font-medium"
                    onClick={() => {
                      handleCreateRoom(userInfo);
                    }}
                  >
                    私信
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : searchKey ? (
        <div className="text-center text-gray-500 mt-4 py-8">
          暂未搜索到相关用户信息
        </div>
      ) : (
        <div className="text-center text-gray-400 mt-4 py-8">
          请输入关键词搜索用户
        </div>
      )}
    </Modal>
  );
});

export default AddFriend;
