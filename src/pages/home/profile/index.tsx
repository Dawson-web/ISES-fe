import ProfileCard from "@/components/profile";
import MyCollects from "./components/MyCollects";
import MyPosts from "./components/MyPosts";

export default function page() {
  return (
    <div className="flex-1 w-full flex flex-col gap-4 ">
      <ProfileCard className="w-full" />
      <MyCollects />
      <MyPosts />
    </div>
  );
}
