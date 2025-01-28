import { FC } from "react";
import clsx from "clsx";
import { CloudMoon, Sun, ToggleLeft, ToggleRight } from "lucide-react";
import { useMantineColorScheme } from "@mantine/core";

interface IProps {
  className?: string;
}

export const DarkMode: FC<IProps> = ({ className }) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };
  return (
    <div className={clsx(className, "font-bold")} onClick={toggleColorScheme}>
      <div className="text-nowrap flex gap-8 ">
        {colorScheme == "light" ? (
          <Sun color="#fbbf24" />
        ) : (
          <CloudMoon color="#4338ca" />
        )}
        主题
      </div>
    </div>
  );
};
