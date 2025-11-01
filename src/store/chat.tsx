import { makeAutoObservable } from "mobx";
import { IChatListItem, ITempChatItem } from "@/types/chat";

type ChatListItem = IChatListItem | ITempChatItem;

class Chat {
  chatlist: ChatListItem[] = [];
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // 添加临时聊天项（未发送消息的）
  addTempChatItem(item: ITempChatItem) {
    // 检查是否已存在
    if (!this.chatlist.find((chat) => chat.userId === item.userId)) {
      this.chatlist.unshift(item);
    }
  }

  // 将临时项转换为正式项（发送第一条消息后）
  convertTempToFormal(userId: string, lastMessage: IChatListItem["lastMessage"]) {
    const index = this.chatlist.findIndex((chat) => chat.userId === userId);
    if (index !== -1 && "isTemp" in this.chatlist[index] && this.chatlist[index].isTemp) {
      const tempItem = this.chatlist[index] as ITempChatItem;
      this.chatlist[index] = {
        userId: tempItem.userId,
        username: tempItem.username,
        avatar: tempItem.avatar,
        introduce: tempItem.introduce,
        school: tempItem.school,
        online: tempItem.online,
        lastMessage,
        unreadCount: 0,
      };
    }
  }

  // 更新聊天列表项的最后一条消息
  updateLastMessage(userId: string, message: IChatListItem["lastMessage"]) {
    const index = this.chatlist.findIndex((chat) => chat.userId === userId);
    if (index !== -1) {
      this.chatlist[index].lastMessage = message;
      // 将该项移到最前面
      const item = this.chatlist.splice(index, 1)[0];
      this.chatlist.unshift(item);
    }
  }

  // 更新未读消息数
  updateUnreadCount(userId: string, count: number) {
    const chat = this.chatlist.find((item) => item.userId === userId);
    if (chat) {
      chat.unreadCount = count;
    }
  }
}

const chatStore = new Chat();
export default chatStore;
