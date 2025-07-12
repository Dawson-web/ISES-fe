import { ICompany, IUserInfo } from "@/types/user";
import { makeAutoObservable } from "mobx";

class User {
  id: string = "";
  userId: string = "";
  username: string = "";
  introduce?: string = "";
  role: number = 0;
  school?: string = "";
  avatar?: string = "";
  banner?: string = "";
  online?: boolean = false;
  grade?: string = "";
  company?: ICompany[];
  circles?: string[] = [];
  major?: string = "";
  techDirection?: string[] = [];
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setUserInfo = (u: IUserInfo) => {
    this.username = u.username;
    this.introduce = u.introduce;
    this.school = u.school;
    this.avatar = u.avatar;
    this.banner = u.banner;
    this.online = u.online;
    this.grade = u.grade;
    this.company = u.company;
    this.circles = u.circles;
    this.major = u.major;
    this.techDirection = u.techDirection;
  };
}
const userStore = new User();
export default userStore;
