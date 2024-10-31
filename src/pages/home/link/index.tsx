import ChatRoom from "@/components/chat-room";

import { useState } from "react";
import { getChatList } from "@/service/chat";
import { getValidUid } from "@/api/token";
import { useQuery } from "@tanstack/react-query";
import LinkCard from "@/components/link_card";
import { apiConfig } from "@/config";

export interface IChatInfo {
  chatId: string;
  chatUser: string;
  userName: string;
  online: number;
}

export default function Page() {
  const [chatInfo, setChatInfo] = useState<IChatInfo>({
    chatId: "",
    chatUser: "",
    userName: "",
    online: 0,
  });

  const [open, setOpen] = useState(false);
  const { isSuccess, data } = useQuery({
    queryKey: ["chatList"],
    queryFn: () => getChatList({ userInfoId: getValidUid() as string }),
  });

  return (
    <div className="w-full flex flex-wrap gap-4">
      {isSuccess &&
        !open &&
        data.data.data.map((chat) => {
          return (
            <LinkCard
              url={`${apiConfig.baseUrl}${chat.avatar}`}
              key={chat.id}
              name={chat.username}
              desc={chat.introduce}
              online={chat.online as number}
              onClick={() => {
                setChatInfo({
                  chatId: chat.id,
                  chatUser: chat.userInfoId,
                  userName: chat.username,
                  online: chat.online as number,
                });
                setOpen(true);
              }}
            />
          );
        })}
      {open && (
        <ChatRoom
          className="w-full h-[90vh]"
          chatInfo={chatInfo}
          setOpen={setOpen}
        />
      )}
    </div>
  );
}
