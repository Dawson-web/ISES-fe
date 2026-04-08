import { $axios } from "../api";
import { ApiOk } from "../api/types";
import {
  ILoginFileds,
  ILoginResponse,
  IRegisterFileds,
  ISeekBackFileds,
} from "../types";

export const getCaptcha = async () => {
  return await $axios.get<ApiOk<{
    captchaId: string;
    svg: string;
    expiresIn: number;
  }>>("/captcha", {
    params: {
      nonce: new Date().getTime(),
    },
  });
};

export const login = async (
  form: ILoginFileds,
  captcha: {
    code: string;
    captchaId: string;
  }
) => {
  return await $axios.post<ApiOk<ILoginResponse>>("/login", {
    email: form.email,
    password: form.password,
    code: captcha.code,
    captchaId: captcha.captchaId,
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
