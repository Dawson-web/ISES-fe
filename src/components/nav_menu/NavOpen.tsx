"use client";

import clsx from "clsx";
import { AlignLeft, X } from "lucide-react";

interface Fiedls {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

export const NavOpen = (props: Fiedls) => {
  const { open, setOpen } = props; // Assuming the component prop is a string that represents the component to render
  const mediaQuery = window.matchMedia("(min-width: 640px)");
  window.addEventListener("resize", () => {
    if (mediaQuery.matches) {
      setOpen(false);
    }
  });

  return (
    <div
      id="nav"
      className={clsx(
        " bg-white dark:bg-theme_dark sm:hidden h-[40px] z-50 w-full rounded-b-md  backdrop-blur-3xl ",
        {
          "fixed  rounded-b-none bg-opacity-100": open,
        }
      )}
    >
      <div
        className={clsx(
          "flex absolute z-50 top-2 left-4 text-gray-600 hover:text-dark dark:text-gray-400 dark:hover:text-gray-200",
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
    </div>
  );
};
