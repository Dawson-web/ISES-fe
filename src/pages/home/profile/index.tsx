import ProfileCard from "@/components/profile";
import { Card } from "@mantine/core";
import MyCollects from "./components/MyCollects";

export default function page() {
  return (
    <Card className="flex-1 w-full">
      <ProfileCard className="w-full" />
      <MyCollects />
    </Card>
  );
}
