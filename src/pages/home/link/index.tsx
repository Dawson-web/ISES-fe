import ChatRoom from "@/components/chat-room";
import LinkCard from "../../../components/link_card";
import { themeConfig } from "../../../config";
import { useState } from "react";

export default function Page() {
  const [chat, setChat] = useState("");
  return (
    <div className="w-full flex flex-wrap gap-4">
      {themeConfig.friend_link.map((item) => (
        <LinkCard
          name={item.name}
          url={item.url}
          descr={item.descr}
          link={item.link}
          key={item.name}
          onClick={() => {
            setChat("16312840702276485000");
          }}
        />
      ))}
      <ChatRoom className="" chat={chat} />
    </div>
  );
}
