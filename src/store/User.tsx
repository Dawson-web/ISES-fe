import { apiConfig } from "@/config";
import { ICompany, IUserInfo } from "@/types/user";
import type { CertificationStatus } from "@/types/certification";
import { makeAutoObservable } from "mobx";

class User {
  id: string = "";
  userId: string = "";
  username: string = "";
  introduce?: string = "";
  role: number = 0;
  certificationStatus?: CertificationStatus = "none";
  certificationFile?: string = "";
  certificationRemark?: string | null = null;
  school?: string = "";
  avatar?: string = "";
  banner?: string = "";
  online?: boolean = false;
  grade?: string = "";
  company?: ICompany[];
  currentCompany?: ICompany;
  circles?: string[] = [];
  major?: string = "";
  techDirection?: string[] = [];
  hitokoto?: string = "";
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setUserInfo = (u: IUserInfo) => {
    this.id = u.id;
    // this.userId = u.userId;
    this.role = u.role;
    this.username = u.username;
    this.introduce = u.introduce;
    this.certificationStatus = u.certificationStatus;
    this.certificationFile = u.certificationFile;
    this.certificationRemark = u.certificationRemark;
    this.school = u.school;
    this.avatar = apiConfig.baseUrl + u.avatar;
    this.banner = u.banner;
    this.online = u.online;
    this.grade = u.grade;
    this.company = u.company;
    this.currentCompany = u.currentCompany;
    this.circles = u.circles;
    this.major = u.major;
    this.techDirection = u.techDirection;
  };
}
const userStore = new User();
export default userStore;
