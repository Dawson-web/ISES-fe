import { useState, useEffect, FC } from "react";
import clsx from "clsx";
import { ToggleLeft, ToggleRight } from "lucide-react";
import darkFunction from "@/utils/dark";

interface IProps {
  className?: string;
}

export const DarkMode: FC<IProps> = ({ className }) => {
  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
    darkFunction(dark);
  }, [dark]); // Add dark to the dependency array

  return (
    <div
      className={clsx(className)}
      onClick={() => {
        setDark((prevDark) => !prevDark); // Use callback to avoid stale closure
      }}
    >
      <div className="text-nowrap flex gap-8 ">
        {!dark ? <ToggleRight /> : <ToggleLeft />}
        暗色
      </div>
    </div>
  );
};
