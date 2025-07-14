import { getCreatorListApi } from "@/service/article";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Card } from "@arco-design/web-react";
import Text from "@arco-design/web-react/es/Typography/text";
import Title from "@arco-design/web-react/es/Typography/title";
import { useNavigate } from "react-router-dom";

const CreatorList = () => {
    const navigate = useNavigate();

    const { data: creatorList } = useQuery({
        queryKey: ['creatorList'],
        queryFn: () => getCreatorListApi().then(res => res.data.data),
    });

    return (
        <div className="w-full md:w-[300px] flex-shrink-0">

            <Card bordered={false}>
                <div className="flex items-center justify-between mb-4">
                    <Title heading={6} className="!m-0">创作者热榜</Title>
                </div>
                {creatorList?.map((creator) => (
                    <div
                        key={creator.creatorId}
                        className=" flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        style={{ border: '1px solid transparent' }}
                        onClick={() => {
                            navigate(`/navigator/profile?id=${creator.creatorId}`);
                        }}
                    >
                        <div className="flex items-center space-x-3 w-full">
                            <Avatar size={32} style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                                {creator.creator.username.charAt(0)}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <Text className="w-full font-medium text-gray-900 text-sm truncate flex items-center justify-between">
                                    <div className="w-14 truncate">{creator.creator.username}</div>
                                </Text>
                                <div className="flex justify-between items-center">
                                    <Text className="text-xs text-gray-500 truncate">
                                        发布 {creator.articleCount} 篇文章
                                    </Text>
                                    <Text className={`text-xs text-gray-500 truncate`}>
                                        {creator.totalViews} 热度
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Card>
        </div>
    );
};

export default CreatorList; 