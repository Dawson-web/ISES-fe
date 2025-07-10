import { Avatar, Button, Result, Tag } from "@arco-design/web-react";
import Text from "@arco-design/web-react/es/Typography/text";
import { IconMessage, IconUser } from "@arco-design/web-react/icon";
import { useNavigate } from "react-router-dom";

// 公司校友数据
const companyAlumni = [
    {
        id: '1',
        name: '张三',
        company: '字节跳动',
        position: '前端工程师',
        status: 'online' as const,
        avatar: '👨‍💻'
    },
    {
        id: '2',
        name: '李四',
        company: '腾讯',
        position: '后端工程师',
        status: 'offline' as const,
        avatar: '👩‍💻'
    },
    {
        id: '3',
        name: '王五',
        company: '阿里巴巴',
        position: '产品经理',
        status: 'online' as const,
        avatar: '👨‍💼'
    },
    {
        id: '4',
        name: '赵六',
        company: '美团',
        position: '算法工程师',
        status: 'offline' as const,
        avatar: '👩‍🔬'
    },
    {
        id: '5',
        name: '钱七',
        company: '滴滴',
        position: 'UI设计师',
        status: 'online' as const,
        avatar: '🎨'
    }
];



const CompanyAlumni = () => {

    const navigate = useNavigate();


    return <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1">
        {/* 公司校友列表 */}
        <div className="mb-4">
            <div className="flex items-center mb-4">
                <IconUser className="mr-2 text-green-500" />
                <Text className="font-medium text-gray-900">公司校友</Text>
            </div>
            <div className="space-y-3">
                {companyAlumni.length > 0 ? companyAlumni.slice(0, 3).map((alumni) => (
                    <>
                        <div
                            key={alumni.id}
                            className=" flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            style={{ border: '1px solid transparent' }}
                        >
                            <div className="flex items-center space-x-3 w-full">
                                <Avatar size={32} style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>
                                    {alumni.name.charAt(0)}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <Text className="w-full font-medium text-gray-900 text-sm truncate flex items-center justify-between">
                                        <div className="w-14 truncate">{alumni.name}</div>
                                        <Tag
                                            size="small"
                                            color={alumni.status === 'online' ? 'green' : 'gray'}
                                            style={{
                                                borderRadius: '12px',
                                                fontSize: '10px'
                                            }}
                                        >
                                            {alumni.status === 'online' ? '在线' : '离线'}
                                        </Tag>
                                    </Text>
                                    <Text className="text-xs text-gray-500 truncate">
                                        {alumni.company} · {alumni.position}
                                    </Text>
                                </div>
                            </div>
                        </div>

                    </>
                )) : (
                    <Result
                        status='404'
                        subTitle='未填写个人公司信息，或公司暂无校友'
                        extra={
                            <Text className='text-blue-500 cursor-pointer' onClick={() => {
                                navigate('/profile')
                            }}>
                                前往填写
                            </Text>
                        }
                    ></Result>
                )}
            </div>
        </div>
    </div>
};

export default CompanyAlumni;