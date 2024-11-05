import { useState, useEffect, FC } from "react";
import clsx from "clsx";
import { ToggleLeft, ToggleRight } from "lucide-react";

function darkFunction(dark: boolean) {
  if (
    dark ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

interface IProps {
  className?: string;
}

export const DarkMode: FC<IProps> = ({ className }) => {
  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    darkFunction(dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]); // Add dark to the dependency array

  return (
    <div className={clsx(className)}>
      <div
        className="text-nowrap flex gap-8"
        onClick={() => {
          setDark((prevDark) => !prevDark); // Use callback to avoid stale closure
        }}
      >
        {!dark ? <ToggleRight /> : <ToggleLeft />}
        暗色
      </div>
    </div>
  );
};
