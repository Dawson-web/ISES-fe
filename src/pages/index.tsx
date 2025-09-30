import homeBg from "../assets/home-bg.png";
import { Button } from "@arco-design/web-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import FadeInAnimation from "../components/animation";

export default function Page() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const targetPathRef = useRef<string>("");

  // 处理按钮点击
  const handleButtonClick = (path: string) => {
    targetPathRef.current = path;
    setIsVisible(false);
  };

  // 淡出动画完成后跳转
  const handleAnimationEnd = () => {
    if (targetPathRef.current) {
      navigate(targetPathRef.current);
    }
  };

  return (
    <>
      <div style={{backgroundImage: `url(${homeBg})`}} className="w-full h-screen bg-cover bg-center bg-no-repeat">
        <FadeInAnimation 
          className="
            px-8 pt-[20vh] 
            sm:px-8 sm:pt-[18vh] 
            md:px-12 md:pt-[20vh] 
            lg:px-16 lg:pt-[22vh] 
            xl:px-20 xl:pt-[24vh] 
            2xl:px-24 2xl:pt-[26vh]
            flex flex-col gap-2 max-w-4xl
          "
          visible={isVisible}
          onAnimationEnd={handleAnimationEnd}
        >
          <div className="text-black font-bold flex items-center">
            <span className="text-black">arco.design</span>
            <div style={{width: '1.5px',height: '12px',background: '#6b7280',margin: '0 8px'}}></div>
            <span className="text-gray-500 font-normal">ises 职引</span>            
          </div>
          <div className="text-black text-5xl font-bold">Instant Share</div>
          <div className="text-gray-600 text-xl mt-2">专为在校生定制的一站式求职爆料平台</div>
          <div className="flex gap-4 mt-8">
            <Button 
              type='primary' 
              className='px-6'
              onClick={() => handleButtonClick('/login')}
            >
              登录
            </Button>
            <Button 
              type='outline' 
              className='px-6'
              onClick={() => handleButtonClick('/register')}
            >
              注册
            </Button>
          </div>
        </FadeInAnimation>
      </div>
    </>
  );
}
