import { Link } from "react-router-dom";
import darkFunction from "@/utils/dark";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") == "dark";
    darkFunction(theme);
  }, []);
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen dark:bg-theme_dark_sm  ">
        <div className="text-2xl sm:text-4xl font-bold flex gap-2 flex-col p-8 bg-gray-100 dark:bg-theme_dark rounded-md min-w-[300px] ">
          <h1 className="text-theme_blue ">Ises.</h1>
          <h1 className="dark:text-white">即刻短文</h1>
          <main className="text-lg sm:text-xl text-gray-500 mt-2 ">
            留下你的故事
            <br />
            捕捉灵感，分享瞬间
            <br />
            随时-随地-随心 — 畅你想
          </main>

          <div className="text-sm mt-[10px] sm:text-xl font-medium text-gray-700 flex gap-4 ">
            <Link
              to={"/login"}
              className="py-1 px-2 bg-theme_blue text-white rounded-md hover:bg-blue-700 flex-1 text-center"
            >
              登录
            </Link>
            <Link
              to={"/register"}
              className="py-1 px-2 bg-theme_blue text-white rounded-md hover:bg-blue-700 flex-1 text-center"
            >
              注册
            </Link>
          </div>
          <footer className="text-xs sm:text-sm text-gray-500 mt-4 flex gap-1 justify-center flex-wrap  ">
            <span>By continuing, you are agreeing to</span>
            <span> Ises's Terms of Service and Privacy Policy.</span>
          </footer>
        </div>
      </div>
    </>
  );
}
