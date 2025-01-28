import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <main className="w-screen h-screen  flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </>
  );
}
