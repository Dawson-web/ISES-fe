import { getCollects } from "@/service/article";
import { IGetCollectsRequest } from "@/types/article";
import { useQuery } from "@tanstack/react-query";
import { ActionIcon, Avatar, Badge, Card, Group, Text } from "@mantine/core";
import avatarSplice from "@/utils/avatar";
import { getDaysSincePublished } from "@/utils/date";
import { Heart } from "lucide-react";

function ArticleCardFooter({ article }) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Card.Section mb="sm"></Card.Section>

      <div className="flex flex-nowrap justify-start items-center gap-2">
        <Badge w="fit-content" variant="light">
          {article.type}
        </Badge>
        <Text fw={700}>{article.title}</Text>
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
const MyCollects = () => {
  const { isSuccess, data } = useQuery({
    queryKey: ["collects"],
    queryFn: () => {
      const params: IGetCollectsRequest = {};
      return getCollects(params);
    },
  });

  return (
    <Card className=" w-full flex flex-col gap-4" radius={"md"}>
      <span className="text-xl font-bold ">我的收藏:</span>
      {isSuccess && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {data.data.data.collects.map((article) => (
            <ArticleCardFooter article={article} />
          ))}
        </div>
      )}
    </Card>
  );
};
export default MyCollects;
