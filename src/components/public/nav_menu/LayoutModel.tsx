import { FC } from "react";
import clsx from "clsx";
import { PanelLeft, PanelTop } from "lucide-react";
import { setLayoutFunction } from "@/utils/layout";

interface IProps {
  className?: string;
  vercel: boolean;
  setVercel: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LayoutModel: FC<IProps> = ({ className, vercel, setVercel }) => {
  return (
    <div
      className={clsx(className)}
      onClick={() => {
        setVercel((prev) => {
          setLayoutFunction(!prev);
          return !prev;
        }); // Use callback to avoid stale closure
      }}
    >
      <div className="text-nowrap flex gap-8">
        {!vercel ? <PanelLeft /> : <PanelTop />}
        {!vercel ? "水平" : "竖直"}
      </div>
    </div>
  );
};
