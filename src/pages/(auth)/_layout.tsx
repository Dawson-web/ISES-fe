import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <main className="w-screen h-screen bg-gray-100 dark:bg-theme_dark_sm flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </>
  );
}
