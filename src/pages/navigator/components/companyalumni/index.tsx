import { getUserCompanyAlumni } from "@/service/user";
import { Avatar, Result, Tag } from "@arco-design/web-react";
import Text from "@arco-design/web-react/es/Typography/text";
import { IconUser } from "@arco-design/web-react/icon";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const CompanyAlumni = () => {

    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ["companyAlumni"],
        queryFn: () => getUserCompanyAlumni().then(res => res.data.data),
    })



    return <div className="bg-white border border-gray-200 p-4 ">
        {/* 公司校友列表 */}
        <div className="mb-4">
            <div className="flex items-center mb-4">
                <IconUser className="mr-2 text-green-500" />
                <Text className="font-medium text-gray-900">公司校友</Text>
            </div>
            <div className="space-y-3">
                {data?.length && data.length > 0 ? data.slice(0, 3).map((alumni) => (
                    <>
                        <div
                            key={alumni.id}
                            className=" flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            style={{ border: '1px solid transparent' }}
                            onClick={() => {
                                navigate(`/navigator/profile?id=${alumni.id}`)
                            }}
                        >
                            <div className="flex items-center space-x-3 w-full">
                                <Avatar size={32} style={{
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}>
                                    {alumni.avatar ?  <img src={alumni.avatar} alt="avatar" />:alumni.username.charAt(0)}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <Text className="w-full font-medium text-gray-900 text-sm truncate flex items-center justify-between">
                                        <div className="w-14 truncate">{alumni.username}</div>
                                        <Tag
                                            size="small"
                                            color={alumni.online ? 'green' : 'gray'}
                                            style={{
                                                borderRadius: '12px',
                                                fontSize: '10px'
                                            }}
                                        >
                                            {alumni.online ? '在线' : '离线'}
                                        </Tag>
                                    </Text>
                                    <Text className="text-xs text-gray-500 truncate">
                                        {alumni.currentCompany?.department} · {alumni.currentCompany?.position}
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
                                navigate('/navigator/profile')
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