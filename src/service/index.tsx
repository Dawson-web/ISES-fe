import { $axios } from "../api";
import { ApiOk } from "../api/types";
import { apiConfig } from "../config";
import {
  ILoginFileds,
  ILoginResponse,
  IRegisterFileds,
  ISeekBackFileds,
} from "../types";
import { getCookie } from "../utils/cookie";

export const getCaptcha = () => {
  return `${apiConfig.baseUrl}/captcha?nonce=${new Date().getTime()}`;
};

export const login = async (form: ILoginFileds, code: string) => {
  console.log("Captcha验证码：", code);
  getCookie("captcha");
  return await $axios.post<ApiOk<ILoginResponse>>("/login", {
    email: form.email,
    password: form.password,
  });
};

export const sendEmailCode = async (email: string) => {
  return await $axios.post<ApiOk<null>>("/email", {
    email,
  });
};

export const register = async (form: IRegisterFileds) => {
  return await $axios.post<ApiOk<string>>("/signup", {
    email: form.email,
    password: form.password,
    code: form.emailCode,
  });
};

export const seekback = async (form: ISeekBackFileds) => {
  return await $axios.post<ApiOk<null>>("/seekback", {
    email: form.email,
    password: form.password,
    code: form.emailCode,
  });
};
