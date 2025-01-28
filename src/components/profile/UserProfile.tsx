import { getValidUid } from "@/api/token";
import { apiConfig } from "@/config";
import { createChatRoom } from "@/service/chat";
import { getOtherUserInfo } from "@/service/user";
import {
  Modal,
  Card,
  Avatar,
  Text,
  Group,
  Button,
  Skeleton,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { FC } from "react";
import { toast } from "sonner";
import AppLogo from "../public/app-logo";
import { useNavigate } from "react-router-dom";
// import classes from "./UserCardImage.module.css";

interface IProps {
  opened: boolean;
  close: () => void;
  userInfoId: string;
}

const UserProfile: FC<IProps> = ({ opened, close, userInfoId }) => {
  const items = (stat: { label: string; value: string }) => (
    <div key={stat.label}>
      <Text ta="center" fz="md" fw={500} className="dark:text-white">
        {stat.value || "暂无"}
      </Text>
      <Text
        ta="center"
        fz="sm"
        c="dimmed"
        lh={1}
        mt={2}
        className="dark:text-white"
      >
        {stat.label}
      </Text>
    </div>
  );
  const navigate = useNavigate();
  const { isSuccess, data } = useQuery({
    queryKey: [userInfoId],
    queryFn: () => {
      const params = { userInfoId };
      return getOtherUserInfo(params);
    },
  });

  async function handleCreateRoom(user2: string) {
    const user1 = getValidUid() as string;
    const data = { user1, user2 };
    try {
      const res = await createChatRoom(data);
      // toast.success(res.data.message);
      navigate(`/home/chat?id=${res.data.data.id}`);
    } catch (e) {
      toast.error("创建失败");
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      className="dark:text-gray-600 [&>div>section]:rounded-xl dark:[&>div>section]:bg-theme_dark_sm dark:[&>div>section>header]:bg-theme_dark [&>div>section>.mantine-Modal-body]:!p-0  "
      withCloseButton={false}
    >
      <AppLogo className="absolute z-50 left-4 top-2" />
      <Card withBorder radius="md" className=" dark:border-gray-600 border-0 ">
        <Card.Section
          h={160}
          style={{
            backgroundImage: "url('../../../public/cover.png')",
            backgroundSize: "cover",
          }}
        />
        {isSuccess ? (
          <Avatar
            src={apiConfig.baseUrl + data.data.data.avatar}
            size={80}
            radius={80}
            mx="auto"
            mt={-30}
          />
        ) : (
          <Skeleton height={80} circle mb="xl" />
        )}

        {isSuccess ? (
          <>
            <Text ta="center" fz="sm" c="dimmed" mt="sm" className="truncate ">
              简介: {data.data.data.introduce || "这个人很懒，什么都没有留下"}
            </Text>
            <Group mt="md" justify="center" gap={30}>
              {items({
                label: "用户名",
                value: data.data.data.username,
              })}
              {items({
                label: "学校",
                value: data.data.data.school,
              })}
              <div key="online">
                <Text
                  ta="center"
                  fz="md"
                  fw={500}
                  className={clsx(
                    data.data.data.online ? "text-theme_blue " : "text-red-500"
                  )}
                >
                  {data.data.data.online ? "在线" : "离线"}
                </Text>
                <Text
                  ta="center"
                  fz="sm"
                  c="dimmed"
                  lh={1}
                  mt={2}
                  className="dark:text-white"
                >
                  状态
                </Text>
              </div>
            </Group>
            <div className="flex flex-nowrap justify-center gap-2">
              <Button
                fullWidth
                radius="md"
                mt="xl"
                size="md"
                variant="default"
                className=" dark:text-white"
              >
                关注
              </Button>
              <Button
                fullWidth
                radius="md"
                mt="xl"
                size="md"
                variant="default"
                className="bg-theme_blue  text-white border-0"
                onClick={async () => {
                  await handleCreateRoom(data.data.data.id as string);
                }}
              >
                私信
              </Button>
            </div>

            <Text ta="right" fz="xs" fw={500} mt="lg" className="text-gray-600">
              UID: {data.data.data.id}
            </Text>
          </>
        ) : (
          <Skeleton height={400} circle mb="xl" />
        )}
      </Card>
    </Modal>
  );
};

export default UserProfile;
