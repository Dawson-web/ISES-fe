import homeBg from "../assets/home-bg.png";
import { Button } from "@arco-design/web-react";
import { useSpring, animated } from "@react-spring/web";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Page() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // 页面挂载后触发淡入动画
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 淡入动画配置
  const fadeInAnimation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
    config: { duration: 800 }
  });

  // 处理按钮点击
  const handleButtonClick = (path: string) => {
    setIsVisible(false);
    
    // 延时跳转，等待淡出动画完成
    setTimeout(() => {
      navigate(path);
    }, 600);
  };

  return (
    <>
      <div style={{backgroundImage: `url(${homeBg})`}} className="w-full h-screen bg-cover bg-center bg-no-repeat">
        <animated.div style={fadeInAnimation} className="pt-[15%] pl-[15%] flex flex-col gap-2">
          <div className="text-black font-bold flex items-center">
            <span className="text-black">arco.design</span>
            <div style={{width: '1.5px',height: '12px',background: '#6b7280',margin: '0 8px'}}></div>
            <span className="text-gray-500 font-normal">Dawson & lpwo443</span>            
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
        </animated.div>
      </div>
    </>
  );
}
