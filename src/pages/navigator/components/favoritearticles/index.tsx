import { Empty, Skeleton, Tag } from "@arco-design/web-react";
import Text from "@arco-design/web-react/es/Typography/text";
import { IconHeart } from "@arco-design/web-react/icon";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { getFavoriteListApi } from "@/service/article";

const FavoriteArticles = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["favorite-articles-home"],
    queryFn: () =>
      getFavoriteListApi({
        page: 1,
        pageSize: 5,
      }).then((res) => res.data.data),
  });

  const favorites = (data?.favorites || []).filter((item) => item.content);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <IconHeart className="mr-2 text-rose-500" />
          <Text className="font-medium text-gray-900">我的收藏</Text>
        </div>
        <Text className="text-xs text-gray-400">{data?.pagination.total || 0} 条</Text>
      </div>

      <Skeleton loading={isLoading} animation text={{ rows: 4 }}>
        {favorites.length ? (
          <div className="space-y-3">
            {favorites.map((favorite) => {
              const article = favorite.content;
              if (!article) {
                return null;
              }

              return (
                <div
                  key={favorite.id}
                  className="rounded-lg border border-transparent px-3 py-2 transition-colors hover:border-rose-100 hover:bg-rose-50 cursor-pointer"
                  onClick={() => navigate(`/navigator/explore/channel?id=${article.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      navigate(`/navigator/explore/channel?id=${article.id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <Text className="flex-1 text-sm font-medium text-gray-900" ellipsis={{ rows: 2 }}>
                      {article.title || "未命名内容"}
                    </Text>
                    <Tag size="small" color="red">
                      收藏
                    </Tag>
                  </div>
                  <Text className="block text-xs text-gray-500">
                    {article.creator?.username || "匿名用户"}
                    {" · "}
                    收藏于 {dayjs(favorite.createdAt).format("MM-DD")}
                  </Text>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty
            description="暂无收藏内容"
            className="py-4"
          />
        )}
      </Skeleton>
    </div>
  );
};

export default FavoriteArticles;
