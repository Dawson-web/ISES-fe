import { makeAutoObservable } from "mobx";
interface companyInfo {
  name: string;
  position: string;
  period: { start: string; end: string };
}
class User {
  id: string = "";
  userId: string = "";
  username: string = "";
  introduce?: string = "";
  role: number = 0;
  school?: string = "";
  avatar?: string = "";
  online?: boolean = false;
  grade?: string = "";
  company?: companyInfo[];
  circles?: string = "";
  major?: string = "";
  technirection?: string = "";
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.init();
  }
  init = () => {
    this.id = "1";
    this.userId = "111";
    this.username = "lsm";
    this.introduce = "前端开发";
    this.role = 1;
    this.school = "成都信息工程大学";
    this.avatar = "#";
    this.online = true;
    this.grade = "20203级";
    this.company = [
      {
        name: "腾讯",
        position: "前端工程师",
        period: { start: "2025-07", end: "2025-07" },
      },
    ];
    this.circles = "回声实验室";
    this.major = "计算机科学与技术";
    this.technirection = "前端开发";
  };
}
export default User;
