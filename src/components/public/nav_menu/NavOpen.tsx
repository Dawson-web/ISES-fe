"use client";

import clsx from "clsx";
import { AlignLeft, X } from "lucide-react";
import AppLogo from "../app-logo";
import { Card } from "@mantine/core";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export const NavOpen = (props: IProps) => {
  const { open, setOpen } = props; // Assuming the component prop is a string that represents the component to render
  const mediaQuery = window.matchMedia("(min-width: 640px)");
  window.addEventListener("resize", () => {
    if (mediaQuery.matches) {
      setOpen(false);
    }
  });

  return (
    <Card
      id="nav"
      className={clsx(
        "  sm:hidden h-[40px] z-50 w-screen  backdrop-blur-3xl p-0",
        {
          "fixed  rounded-b-none bg-opacity-100": open,
        }
      )}
    >
      <AppLogo className={clsx("ml-4 dark:text-gray-600", { hidden: open })} />
      <div
        className={clsx(
          "flex absolute z-50 top-2 right-4 text-gray-600 hover:text-dark dark:text-gray-400 dark:hover:text-gray-200",
          {
            "transition-transform duration-500 rotate-90": open,
            "transition-transform duration-500 rotate-0": !open,
          }
        )}
      >
        <AlignLeft
          className={clsx("absolute", {
            "z-0 transition duration-500	opacity-0  ": open,
            "z-20 transition duration-500	deley-200 opacity-1": !open,
          })}
          onClick={() => setOpen(true)}
        />
        <X
          className={clsx({
            "z-20 transition-opacity duration-500 deley-200	opacity-1": open,
            "transition-opacity duration-500	opacity-0": !open,
          })}
          onClick={() => setOpen(false)}
        />
      </div>
    </Card>
  );
};
