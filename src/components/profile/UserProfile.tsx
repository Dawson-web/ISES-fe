import { apiConfig } from "@/config";
import { getOtherUserInfo, getUserInfo } from "@/service/user";
import { Modal, Card, Avatar, Text, Group, Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
// import classes from "./UserCardImage.module.css";

const stats = [
  { value: "34K", label: "Followers" },
  { value: "187", label: "Follows" },
  { value: "1.6K", label: "Posts" },
];

interface IProps {
  opened: boolean;
  close: () => void;
  userInfoId: string;
}

const UserProfile: FC<IProps> = ({ opened, close, userInfoId }) => {
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text ta="center" fz="lg" fw={500} className="dark:text-white">
        {stat.value}
      </Text>
      <Text ta="center" fz="sm" c="dimmed" lh={1} className="dark:text-white">
        {stat.label}
      </Text>
    </div>
  ));

  const { isSuccess, isPending, data } = useQuery({
    queryKey: [userInfoId],
    queryFn: () => {
      const params = { userInfoId };
      return getOtherUserInfo(params);
    },
  });
  if (isPending) return <div>Loading...</div>;
  if (isSuccess)
    return (
      <Modal
        opened={opened}
        onClose={close}
        centered
        title="简介"
        className="dark:text-gray-600 dark:[&>div>section]:bg-theme_dark_sm dark:[&>div>section>header]:bg-theme_dark "
      >
        <Card
          withBorder
          padding="xl"
          radius="md"
          className="bg-white dark:bg-theme_dark dark:border-gray-600"
        >
          <Card.Section
            h={140}
            style={{
              backgroundImage: "url('../../../public/cover.png')",
              backgroundSize: "cover",
            }}
          />
          <Avatar
            src={apiConfig.baseUrl + data.data.data.avatar}
            size={80}
            radius={80}
            mx="auto"
            mt={-30}
            className={""}
          />
          <Text
            ta="center"
            fz="lg"
            fw={500}
            mt="sm"
            className="dark:text-white"
          >
            {data.data.data.username}
          </Text>
          <Text ta="center" fz="sm" c="dimmed" className="truncate ">
            {data.data.data.introduce || "这个人很懒，什么都没有留下"}
          </Text>
          <Group mt="md" justify="center" gap={30}>
            {items}
          </Group>
          <Button
            fullWidth
            radius="md"
            mt="xl"
            size="md"
            variant="default"
            className="bg-white dark:bg-theme_dark dark:text-white"
          >
            Follow
          </Button>
        </Card>
      </Modal>
    );
};

export default UserProfile;
