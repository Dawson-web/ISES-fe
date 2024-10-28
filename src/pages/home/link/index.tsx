import ChatRoom from "@/components/chat-room";
import LinkCard from "../../../components/link_card";
import { themeConfig } from "../../../config";
import { useEffect, useState } from "react";
import { getChatList } from "@/service/chat";
import { getValidUid } from "@/api/token";
import { IGetChatListResponse } from "@/types/chat";

let isInited = false;

export default function Page() {
  const [chatId, setChatId] = useState("");
  const [open, setOpen] = useState(false);
  const [chatList, setChatList] = useState<IGetChatListResponse[]>([]);
  useEffect(() => {
    if (!isInited) {
      getChatList({ userInfoId: getValidUid() as string }).then((res) => {
        setChatList(res.data.data);
        isInited = true;
      });
    }
  }, []);
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
      {chatList.map((chat) => {
        return (
          <div
            onClick={() => {
              setChatId("242108044931321300");
              setOpen(true);
            }}
          >
            {chat.id}
          </div>
        );
      })}
      {open && <ChatRoom className="" chatId={chatId} setOpen={setOpen} />}
    </div>
  );
}
