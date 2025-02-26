import { getValidUid } from "@/api/token";
import UserAvatar from "@/components/public/user_avatar";
import { toastMessage } from "@/components/toast";
import { createChatRoom } from "@/service/chat";
import { searchUsers } from "@/service/user";
import avatarSplice from "@/utils/avatar";
import { Button, Card, Input, Modal, ModalHeader } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";

import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// import classes from "./UserCardImage.module.css";

interface IProps {
  opened: boolean;
  close: () => void;
}

const AddFriend: FC<IProps> = ({ opened, close }) => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const [searchKey, setSearchKey] = useState("");
  const { isSuccess, data } = useQuery({
    queryKey: ["searchUser", searchKey],
    queryFn: () => searchUsers({ searchKey }),
  });

  async function handleCreateRoom(user2: string) {
    const user1 = getValidUid() as string;
    const data = { user1, user2 };
    try {
      const res = await createChatRoom(data);
      // toast.success(res.data.message);
      navigate(`/home/chat?id=${res.data.data.id}`);
    } catch (e) {
      toastMessage.error("创建失败");
    }
  }
  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      className=" "
      withCloseButton={false}
    >
      <ModalHeader>查找用户</ModalHeader>
      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
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
      />
      {isSuccess && data.data.data.length ? (
        <div className="flex flex-col gap-2 mt-2">
          {data.data.data.map((userInfo) => {
            return (
              <Card className="p-2 " key={userInfo.id}>
                <div className="flex items-center gap-4">
                  <UserAvatar
                    src={userInfo.avatar}
                    size="small"
                    disabled={true}
                  />
                  <div className="text-lg font-bold">
                    {userInfo.username || "这个人很懒未留名"}
                  </div>
                  <div
                    className="absolute right-4 text-theme_blue"
                    onClick={async () => {
                      await handleCreateRoom(userInfo.id);
                    }}
                  >
                    私信
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <>暂未搜索到相关用户信息</>
      )}
    </Modal>
  );
};

export default AddFriend;
