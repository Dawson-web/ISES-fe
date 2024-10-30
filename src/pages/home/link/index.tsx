import ChatRoom from "@/components/chat-room";
import LinkCard from "../../../components/link_card";
import { themeConfig } from "../../../config";
import { useState } from "react";
import { getChatList } from "@/service/chat";
import { getValidUid } from "@/api/token";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const [chatId, setChatId] = useState("");
  const [chatUser, setChatUser] = useState("");
  const [open, setOpen] = useState(false);
  const { isSuccess, data } = useQuery({
    queryKey: ["chatList"],
    queryFn: () => getChatList({ userInfoId: getValidUid() as string }),
  });

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
            setChatId("242108044931321300");
            setOpen(true);
          }}
        />
      ))}
      {isSuccess &&
        data.data.data.map((chat) => {
          return (
            <div
              onClick={() => {
                setChatId(chat.id);
                setChatUser(
                  getValidUid() == chat.user1 ? chat.user2 : chat.user1
                );
                setOpen(true);
              }}
            >
              {chat.id}-{chat.user1}
            </div>
          );
        })}
      {open && (
        <ChatRoom
          className="w-full h-[60%]"
          chatId={chatId}
          chatUser={chatUser}
          setOpen={setOpen}
        />
      )}
    </div>
  );
}
