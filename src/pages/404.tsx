import { Button } from "@arco-design/web-react";
import Text from "@arco-design/web-react/es/Typography/text";

const Page = () => {
    return (
        <div className="flex items-center sm:flex-row flex-col justify-center h-screen ">
            {/* 装饰性图片 */}
            <div className="w-3/5">
                <img
                    src="https://s1.aigei.com/prevfiles/e9376421f6f741c095c88c03a7bb4138.gif?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:FYxLbRF0IxOn_oHJMnz2o0UWwsw="
                    className='w-full h-auto object-contain'
                    alt="ISES动画"
                />
            </div>
            <div className="w-2/5">
                <div className="flex items-center gap-2 flex-col sm:flex-row">
                <Text className="text-4xl font-bold text-nowrap">
                    404
                </Text>
                <Text className="text-3xl font-bold text-nowrap">
               Page Not Found
                </Text>
                </div>
                <p className="text-gray-500 sm:text-xl text-base mt-4">
                    你迷失在了神秘的角落，让小黑带你回家吧
                </p>
                <Button className=" font-bold text-lg mt-4 cursor-pointer text-theme_blue">前往异世界 -&gt; 🚪</Button>
            </div>
        </div>
    )
}

export default Page;