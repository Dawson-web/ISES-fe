import { FC } from "react";
import clsx from "clsx";
import { PanelLeft, PanelTop } from "lucide-react";

interface IProps {
  className?: string;
  vercel: boolean;
  setVercel: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LayoutModel: FC<IProps> = ({ className, vercel, setVercel }) => {
  return (
    <div className={clsx(className)}>
      <div
        className="text-nowrap flex gap-8"
        onClick={() => {
          setVercel((prev) => !prev); // Use callback to avoid stale closure
        }}
      >
        {!vercel ? <PanelLeft /> : <PanelTop />}
        {!vercel ? "水平" : "竖直"}
      </div>
    </div>
  );
};
