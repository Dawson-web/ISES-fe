export interface IAccountData {
  email: string;
  password?: string;
}

export interface IUserInfo {
  userId: number;
  username: string;
  avatar: string;
}

export interface IUserFormData {
  id: string;
  introduce: string;
  role: number;
  username: string;
  avatar: string;
  school: string;
  createdAt: string;
  updatedAt: string;
  User: IAccountData;
  online: boolean;
}

export interface IUpdateUserForm {
  username: string;
  introduce: string;
  school: string;
}

export interface IFormContext {
  userFormData: IUserFormData;
  updateFormData: (key: string, data: unknown) => void;
}
