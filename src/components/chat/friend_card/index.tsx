// import { agreeChatRoom } from "@/service/chat";
import { Button } from "@mantine/core";
import clsx from "clsx";

function FriendCard(props: any) {
  const {
    url,
    name,
    onClick,
    online,
    connect,
    temporary,
    className,
  } = props;

  async function handleAgreeChatRoom() {
    // const data = {
    //   chatListId: chatListId,
    // };
    // await agreeChatRoom(data);
  }
  return (
    <div className={clsx(className)}>
      <div className="flex  items-center justify-around">
        <aside
          className={clsx("w-[60px] h-[60px]  relative ")}
          onClick={onClick}
        >
          <img
            src={url || "https://www.betula.space/images/avatar.png"}
            alt="avatar"
            className="rounded-full w-full h-full object-cover"
          />
          <div
            className={clsx(
              " border-white border-4 rounded-full w-[20px] h-[20px] absolute bottom-[0px] right-[0px]",
              online ? "bg-green-500" : "bg-red-500"
            )}
          ></div>
        </aside>
        <main className="w-[70%] text-center  font-medium p-2 flex flex-col items-start">
          <div className="text-lg font-bold">{name || "这个人很懒未留名"}</div>
          {/* <div className="text-sm">{descr || "这个人很懒未留简介"}</div> */}
          {!connect ? (
            <div className="text-sm font-semibold text-theme_blue flex flex-col items-center justify-between gap-4 text-wrap  ">
              <p> 临时通讯</p>
              {temporary && (
                <Button
                  className="bg-theme_blue p-2"
                  onClick={handleAgreeChatRoom}
                >
                  同意申请
                </Button>
              )}
            </div>
          ) : (
            ""
          )}
        </main>
      </div>
    </div>
  );
}

export default FriendCard;
