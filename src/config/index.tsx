import { Home, Link, PodcastIcon, User } from "lucide-react";

export const apiConfig = {
  // baseUrl: "http://127.0.0.1:3000",
  baseUrl: window.location.protocol + "//43.139.172.162:3000",
  unProtectedUrls: ["/login", "/captcha", "/signup", "/email", "/seekback"],
};

export const themeConfig = {
  site: {
    name: "ISES",
    descr: "即刻短文",
  },
  menu: {
    options: [
      {
        name: "个人",
        herf: "/home/profile",
        icon: <User />,
      },
      {
        name: "主页",
        herf: "/home",
        icon: <Home />,
      },
      {
        name: "发布",
        herf: "/home/post",
        icon: <PodcastIcon />,
      },
      {
        name: "友链",
        herf: "/home/chat",
        icon: <Link />,
      },
    ], // 菜单配置
    darkMode: true, // 是否开启暗黑模式按钮
    avatar_show: true, // 是否显示头像
  },
};

export const formConfig = {
  maintenanceForm: {
    title: "表单",
    fields: [
      {
        key: "email",
        label: "邮箱",
        type: "text",
      },
      {
        key: "password",
        label: "密码",
        type: "password",
      },
      {
        key: "img",
        label: "身份证照片",
        type: "file",
      },
      {
        key: "age",
        label: "年龄",
        type: "number",
      },
      {
        key: "termsOfService",
        label: "I agree to sell my privacy",
        type: "checkbox",
      },
    ],
  },
};
