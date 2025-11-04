import {
  Card,
  Avatar,
  Typography,
  Tag,
  Descriptions,
  Space,
  Button,
  Grid,
  Image,
} from "@arco-design/web-react";
import {
  IconUser,
  IconBook,
  IconCode,
  IconEdit,
} from "@arco-design/web-react/icon";
import { useEffect, useState } from "react";
import { IUserInfo } from "@/types/user";
import EditProfileDrawer from "@/components/profile/EditProfileDrawer";
import { getUserInfoApi, updateUserInfo } from "@/service/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userStore from "@/store/User";
import homeBG from "@/assets/home-bg.png";
import { observer } from "mobx-react-lite";
import { useSearchParams } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;
const { Row, Col } = Grid;

const roleMap = {
  0: { text: "普通用户", color: "blue" },
  1: { text: "VIP用户", color: "gold" },
  2: { text: "管理员", color: "red" },
};


const Page = observer(() => {
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [searchParams] = useSearchParams()
  const [viewRole, setViewRole] = useState(0) // 0 非自己 1 自己
  const queryClient = useQueryClient();

  //修改信息抽屉
  const handleSaveProfile = (u: IUserInfo) => {
    const {
      username,
      introduce,
      school,
      grade,
      circles,
      major,
      techDirection,
      company,
    } = u;
    mutateUserInfo({
      username,
      introduce,
      school,
      grade,
      circles,
      major,
      techDirection,
      company,
    });
    userStore.setUserInfo(u);
    setEditDrawerVisible(false);
  };

  //渲染标签
  const renderTags = (tagsString?: string[]) => {
    if (!tagsString || tagsString.length === 0) return <Text type="secondary" className="ml-2">-</Text>;
    return (
      <Space wrap>
        {tagsString.map((tag, index) => (
          <Tag key={index} color="arcoblue" size="small">
            {tag.trim()}
          </Tag>
        ))}
      </Space>
    );
  };

  //修改信息
  const { mutate: mutateUserInfo } = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  useEffect(() => {
    if (!searchParams.get('id') || searchParams.get('id') === userStore.id) {
      setViewRole(1)
    } else {
      setViewRole(0)
    }
  }, [searchParams.get('id')])

  const { data: userInfo, isLoading } = useQuery({
    queryKey: ['userInfo', searchParams.get('id')],
    queryFn: () => getUserInfoApi(searchParams.get('id') || '').then(res => res.data.data),
  })

  const _userInfo = viewRole === 1 ? userStore : userInfo



  return (
    isLoading ? <div>加载中...</div> :
      <div className="py-4 px-6 bg-[#F7F8FA] min-h-screen">
        <div className="mx-auto">
          {/* 用户头部卡片 */}
          <Card
            className=" mb-4"
            cover={
              <div className="max-h-48 overflow-hidden">
                <Image
                  src={_userInfo?.banner || homeBG}
                  className="w-full h-full object-contain "
                />
              </div>

            }
          >
            <div className="relative">
              <div className="flex flex-col items-start gap-5 flex-wrap">
                <div className="relative -mt-16">
                  <Avatar
                    size={80}
                    className="border-4 border-white shadow-lg bg-cover bg-center "
                    style={{
                      backgroundImage: _userInfo?.avatar
                        ? `url(${_userInfo.avatar})`
                        : undefined,
                    }}
                  >
                    {!_userInfo?.avatar && _userInfo?.username?.charAt(0)}
                  </Avatar>
                </div>

                <div className="flex-1 pt-2 w-full flex-wrap">
                  <div className="flex items-center gap-3 mb-4">
                    <Title heading={2} style={{ margin: 0 }}>
                      {_userInfo?.username || 'Aigei'}
                    </Title>
                    <Tag
                      color={
                        roleMap[_userInfo?.role as keyof typeof roleMap]?.color ||
                        "blue"
                      }
                    >
                      {roleMap[_userInfo?.role as keyof typeof roleMap]?.text ||
                        "普通用户"}
                    </Tag>
                  </div>

                  <Paragraph className="text-gray-600 mb-4">
                    {_userInfo?.introduce || "这个人很懒，什么都没有留下..."}
                  </Paragraph>

                  <div className="flex gap-2 flex-wrap">
                    {
                      viewRole === 0 ?
                        <>
                          <Button type="primary" size="small">
                            <IconUser /> 关注
                          </Button>
                          <Button type="outline" size="small">
                            发送私信
                          </Button>
                        </>
                        :
                        <Button
                          type="outline"
                          size="small"
                          onClick={() => setEditDrawerVisible(true)}
                        >
                          <IconEdit /> 编辑资料
                        </Button>
                    }
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Row gutter={24}>
            <Col span={24}>
              <Card title="实习经历" className="mb-4 ">
                <div className="flex flex-col gap-4">
                  {_userInfo?.company?.map((item) => (
                    <div className="space-y-4">
                      {/* 公司基本信息 */}
                      <div className="border-l-4 border-blue-500 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900 mb-1 text-wrap flex gap-4 items-center">
                              {item.name} - {item.location}
                              {item.endDate === '至今' && <Tag color="green">在职</Tag>}
                            </h4>
                            <p className="text-gray-600 text-wrap">
                              {item.department} - {item.position}
                            </p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            {item.startDate} - {item.endDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {_userInfo?.company?.length === 0 && (
                    <Text type="secondary" className="text-center">
                      暂无实习经历
                    </Text>
                  )}
                </div>
              </Card>
            </Col>

            <Col span={12}>
              <Card title="基本信息" className="mb-4 ">
                <Descriptions
                  column={1}
                  colon={":"}
                  data={[
                    {
                      label: "学校",
                      value: _userInfo?.school || "-",
                    },
                    {
                      label: "专业",
                      value: _userInfo?.major || "-",
                    },
                    {
                      label: "年级",
                      value: _userInfo?.grade || "-",
                    },
                    {
                      label: "在职公司",
                      value: _userInfo?.currentCompany?.name || "-",
                    },
                    {
                      label: "在职职位",
                      value: `${_userInfo?.currentCompany?.department}-${_userInfo?.currentCompany?.position}` || "-",
                    },
                  ]}
                  layout="inline-horizontal"
                  labelStyle={{ color: "#4e5969", fontWeight: "500" }}
                  valueStyle={{ color: "#1d2129" }}
                />
              </Card>
            </Col>

            <Col span={12}>
              <Card title="技能与兴趣" className="mb-4 ">
                <div className="mb-4">
                  <Text className="font-medium text-gray-600 mb-2 block">
                    <IconCode /> 技术方向
                  </Text>
                  {renderTags(_userInfo?.techDirection)}
                </div>
                <div>
                  <Text className="font-medium text-gray-600 mb-2 block">
                    <IconBook /> 兴趣圈子
                  </Text>
                  {renderTags(_userInfo?.circles)}
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        <EditProfileDrawer
          visible={editDrawerVisible}
          onClose={() => setEditDrawerVisible(false)}
          userInfo={_userInfo as IUserInfo}
          onSave={handleSaveProfile}
        />
      </div>
  );
});

export default Page;
