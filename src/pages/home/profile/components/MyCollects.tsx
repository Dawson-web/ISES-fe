import { getCollects } from "@/service/article";
import { IGetCollectsRequest } from "@/types/article";
import { useQuery } from "@tanstack/react-query";
import { ActionIcon, Avatar, Badge, Card, Group, Text } from "@mantine/core";
import { apiConfig } from "@/config";
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

      <Card.Section>
        <Group justify="space-between">
          <Text fz="xs" c="dimmed">
            733 people liked this
          </Text>
          <Group gap={0}>
            <ActionIcon variant="subtle" color="gray">
              <Heart size={20} color="red" />
              {/* <IconHeart size={20} color={theme.colors.red[6]} stroke={1.5} /> */}
              {article.likesCount}
            </ActionIcon>

            {/* <ActionIcon variant="subtle" color="gray">
              <IconBookmark
                size={20}
                color={theme.colors.yellow[6]}
                stroke={1.5}
              />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray">
              <IconShare size={20} color={theme.colors.blue[6]} stroke={1.5} />
            </ActionIcon> */}
          </Group>
        </Group>
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
    <Card className=" w-full flex flex-col gap-4">
      <span className="text-xl font-bold ">我的收藏</span>
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
