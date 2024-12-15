import clsx from "clsx";
import { FC } from "react";
import AppLogo from "../app-logo";
interface IProps {
  className?: string;
}

const News: FC<IProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        " w-full p-4 rounded-lg shadow-md  flex  items-end ",
        className
      )}
    >
      <div className="flex flex-col items-start justify-center  gap-4">
        <AppLogo className="text-5xl  opacity-80 " />
        <p className="text-white font-bold text-sm ">封闭开发中,敬请期待！</p>
      </div>
    </div>
  );
};
export default News;
