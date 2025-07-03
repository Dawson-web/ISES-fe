import clsx from "clsx";
import { FC } from "react";

const AppLogo: FC<{title?:string,subtitle?:string,size?:string }> = ({ title, subtitle, size }) => {
  return (
    <div className={clsx("text-black font-bold flex items-center")} style={{fontSize:size}}>
      <span className="text-black">{title || 'arco.design'}</span>
      <div style={{ width: '1.5px', height: '12px', background: '#6b7280', margin: '0 8px' }}></div>
      <span className="text-gray-500 font-normal">{subtitle || 'subtitle'}</span>            
    </div>
  );
};
export default AppLogo;
