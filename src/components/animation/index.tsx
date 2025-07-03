import { useSpring, animated } from "@react-spring/web";
import { useState, useEffect, ReactNode } from "react";

interface FadeInAnimationProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  translateY?: number;
  visible?: boolean; // 外部控制显示/隐藏
  onAnimationEnd?: () => void; // 动画完成回调
}

export default function FadeInAnimation({ 
  children, 
  className = "", 
  duration = 800, 
  delay = 0,
  translateY = 20,
  visible,
  onAnimationEnd
}: FadeInAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  // 页面挂载后触发淡入动画
  useEffect(() => {
    if (visible === undefined) {
      // 自动模式：挂载后自动淡入
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      // 受控模式：根据visible属性控制
      setIsVisible(visible);
    }
  }, [delay, visible]);

  // 淡入动画配置
  const fadeInAnimation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? `translateY(0px)` : `translateY(${translateY}px)`,
    config: { duration },
    onRest: () => {
      // 动画完成时调用回调
      if (onAnimationEnd && !isVisible) {
        onAnimationEnd();
      }
    }
  });

  return (
    <animated.div style={fadeInAnimation} className={className}>
      {children}
    </animated.div>
  );
} 