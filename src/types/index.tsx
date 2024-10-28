export interface ILoginFileds {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  userInfoId: string;
}

export interface IRegisterFileds {
  email: string;
  password: string;
  _confirmPassword: string;
  emailCode: string;
}

export interface ISeekBackFileds {
  email: string;
  password: string;
  emailCode: string;
}
