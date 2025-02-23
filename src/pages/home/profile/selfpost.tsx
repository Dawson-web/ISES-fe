import { getArticlePagination, getCollects } from "@/service/article";
import { IGetCollectsRequest, IPaginationRequest } from "@/types/article";
import { useQuery } from "@tanstack/react-query";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Text,
} from "@mantine/core";
import avatarSplice from "@/utils/avatar";
import { getDaysSincePublished } from "@/utils/date";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ArticleCardFooter({ article }) {
  const navigate = useNavigate();
  return (
    <Card withBorder padding="lg" radius="md">
      <Card.Section mb="sm"></Card.Section>
      <div className="flex flex-nowrap justify-between items-center gap-2">
        <div className="flex flex-nowrap justify-start items-center gap-2">
          <Badge w="fit-content" variant="light">
            {article.type}
          </Badge>
          <Text fw={700}>{article.title}</Text>
        </div>
        <Button
          size="sm"
          variant="light"
          onClick={() => {
            navigate(`/home/article/edit?id=${article.id}`);
          }}
        >
          详情
        </Button>
      </div>
      <Group mt="lg">
        <Avatar
          src={
            avatarSplice(article.userInfoId) ||
            "https://www.betula.space/images/avatar.png"
          }
          radius="sm"
        />
        <div>
          <Text fw={500}>Elsa Gardenowl</Text>
          <Text fz="xs" c="dimmed">
            发布于{getDaysSincePublished(article.createdAt)}天前
          </Text>
        </div>
      </Group>

      <Card.Section className="flex flex-row  justify-end items-center gap-2  mr-0">
        <ActionIcon variant="subtle" color="gray">
          <Heart size={20} color="red" />
        </ActionIcon>
        <Text fz="xs" c="dimmed">
          {article.likesCount}
          people liked this
        </Text>
      </Card.Section>
    </Card>
  );
}
const SelfPosts = () => {
  const { isSuccess, data } = useQuery({
    queryKey: ["mypost"],
    queryFn: () => {
      const params: IPaginationRequest = {
        page: 1,
        pageSize: 9999,
        userInfoId: String(localStorage.getItem("uid")),
      };
      return getArticlePagination(params);
    },
  });
  const [info, setInfo] = useState({
    totalLikes: 0,
    totalPosts: 0,
  });
  useEffect(() => {
    let totalLikes = 0;
    let totalPosts = 0;
    data?.data.data.articles.map((article) => {
      totalLikes += Number(article.likesCount);
      totalPosts += 1;
    });
    setInfo({
      totalLikes,
      totalPosts,
    });
  }, [data]);

  return (
    <Card className=" w-full flex flex-col gap-4" radius={"md"}>
      <div className="flex justify-between items-center ">
        <span className="text-xl font-bold ">我的发布:</span>
      </div>
      <div className="flex gap-4">
        <Badge variant="gradient">点赞总数: {info.totalLikes}</Badge>
        <Badge variant="gradient">发布总数: {info.totalPosts}</Badge>
      </div>
      {isSuccess && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {data.data.data.articles.map((article) => (
            <ArticleCardFooter article={article} />
          ))}
        </div>
      )}
    </Card>
  );
};
export default SelfPosts;
