import { Card, Grid, Skeleton, Space, Avatar } from "@arco-design/web-react";

interface IProps {
    count: number;
    type?: 'list-user' | 'list-info';
    className?: string;
}

const ISESSkeleton: React.FC<IProps> = ({ count, type = 'list-info', className }) => {
    if (type === 'list-user') {
        return (
            <Card bordered={false} className={className}>
                <div className="space-y-3">
                    {Array(count).fill(null).map((_, index) => (
                        <div key={`skeleton-${index}`} className="flex items-center gap-3">
                            <Skeleton
                                image={{ shape: 'circle' }}
                                animation
                                className="mt-8"
                            >              <Avatar size={40} />
                            </Skeleton>
                            <div className="flex-1 min-w-0">
                                <Skeleton animation text={{ rows: 1, width: "100%" }} className="mb-3" />
                                <Skeleton animation text={{ rows: 1, width: "80%" }} />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <>
            {Array(count).fill(null).map((_, index) => (
                <Grid.Col key={`skeleton-${index}`} span={24}>
                    <Card className={`border-none rounded-none ${className}`}>
                        <div className="flex gap-4">
                            {/* 左侧头像骨架屏 */}
                            <div className="flex-shrink-0">
                                <Skeleton animation>
                                    <Avatar style={{ width: '40px', height: '40px' }} />
                                </Skeleton>
                            </div>

                            {/* 右侧内容骨架屏 */}
                            <div className="flex-1 min-w-0">
                                {/* 作者信息骨架屏 */}
                                <div className="flex items-center gap-2 mb-2">
                                    <Skeleton animation text={{ rows: 1, width: '100%' }} />
                                    <Skeleton animation text={{ rows: 1, width: '100%' }} />
                                </div>

                                {/* 标题骨架屏 */}
                                <div className="mb-2">
                                    <Skeleton animation text={{ rows: 1, width: '100%' }} />
                                </div>

                                {/* 内容骨架屏 */}
                                <div className="mb-3">
                                    <Skeleton animation text={{ rows: 2, width: ['100%', '80%'] }} />
                                </div>

                                {/* 数据骨架屏 */}
                                <Space size="large">
                                    <Skeleton animation text={{ rows: 1, width: 50 }} />
                                    <Skeleton animation text={{ rows: 1, width: 50 }} />
                                    <Skeleton animation text={{ rows: 1, width: 50 }} />
                                </Space>
                            </div>
                        </div>
                    </Card>
                </Grid.Col>
            ))}
        </>
    );
};

export default ISESSkeleton;