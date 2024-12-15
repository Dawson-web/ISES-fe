import darkFunction from "@/utils/dark";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") == "dark";
    darkFunction(theme);
  }, []);
  return (
    <>
      <main className="w-screen h-screen bg-gray-100 dark:bg-theme_dark_sm flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </>
  );
}
