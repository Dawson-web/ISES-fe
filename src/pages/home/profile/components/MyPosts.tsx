import { getArticlePagination, getCollects } from "@/service/article";
import { IGetCollectsRequest, IPaginationRequest } from "@/types/article";
import { useQuery } from "@tanstack/react-query";
import { ActionIcon, Avatar, Badge, Card, Group, Text } from "@mantine/core";
import avatarSplice from "@/utils/avatar";
import { getDaysSincePublished } from "@/utils/date";
import { Heart } from "lucide-react";

function ArticleCardFooter({ article }) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Card.Section mb="sm"></Card.Section>

      <Badge w="fit-content" variant="light">
        {article.type}
      </Badge>

      <Text fw={700} mt="xs">
        {article.title}
      </Text>

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

      <Card.Section className="flex flex-row  justify-end items-center gap-2 mt-2">
        <Text fz="xs" c="dimmed">
          {article.likesCount}
          people liked this
        </Text>
        <ActionIcon variant="subtle" color="gray">
          <Heart size={20} color="red" />
        </ActionIcon>
      </Card.Section>
    </Card>
  );
}
const MyPosts = () => {
  const { isSuccess, data } = useQuery({
    queryKey: ["mypost"],
    queryFn: () => {
      const params: IPaginationRequest = {
        page: 1,
        pageSize: 9999,
        title: "",
      };
      return getArticlePagination(params);
    },
  });

  return (
    <Card className=" w-full flex flex-col gap-4" radius={"md"}>
      <span className="text-xl font-bold ">我的发布</span>
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
export default MyPosts;
