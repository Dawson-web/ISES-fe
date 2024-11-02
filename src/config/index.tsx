import { Home, Link, PodcastIcon, User } from "lucide-react";

export const apiConfig = {
  // baseUrl: "http://47.93.254.190:3000",
  baseUrl: "http://127.0.0.1:3000",
  unProtectedUrls: ["/login", "/captcha", "/signup", "/email", "/seekback"],
};

export const themeConfig = {
  site: {
    name: "RDTF",
    descr: "一个基于Vite+React+TS的快速模板框架",
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
      // {
      //   name: "组件",
      //   herf: "/home/components",
      //   icon: <Album />,
      // },
      {
        name: "友链",
        herf: "/home/link",
        icon: <Link />,
      },
    ], // 菜单配置
    darkMode: true, // 是否开启暗黑模式按钮
    avatar_show: true, // 是否显示头像
  },
  // profile: [
  //   {
  //     name: "用户名",
  //     value: "Dawson",
  //     icon: <User />,
  //   },
  //   {
  //     name: "ID",
  //     value: "XXXXXXXXX",
  //     icon: <ScanEye />,
  //   },
  //   {
  //     name: "电话",
  //     value: "17380333759",
  //     icon: <PhoneCall />,
  //   },
  //   {
  //     name: "住址",
  //     value: "成都市锦江区",
  //     icon: <MapPinned />,
  //   },
  //   {
  //     name: "邮箱",
  //     value: "3096567831@qq.com",
  //     icon: <Mail />,
  //   },
  //   {
  //     name: "生日",
  //     value: "04-21",
  //     icon: <Calendar />,
  //   },
  // ],
  // friend_link: [
  //   {
  //     name: "bakptr",
  //     descr: "社恐但无所不知的bakaptr",
  //     link: "https://pooi.me/",
  //     url: "https://q.qlogo.cn/g?b=qq&nk=369060891&s=160",
  //   },
  //   {
  //     name: "未晓",
  //     descr: "一只正在学习前端的未晓",
  //     link: "https://www.dawnot.online/",
  //     url: "https://q.qlogo.cn/g?b=qq&nk=1537476031&s=160",
  //   },
  //   {
  //     name: "For You",
  //     descr:
  //       "螃蟹在剥我的壳, 笔记本在写我,  漫天的我落在枫叶上雪花上, 而你在想我。",
  //     link: "https://lackofcsy.cn/",
  //     url: "http://qn.lackofcsy.cn/config/055c0cb176b1f4c0cdb91e277a8eeb05.jpg",
  //   },
  //   {
  //     name: "Latinaxia",
  //     descr: "屑劳坂的草台班子",
  //     link: "https://latinaxia.github.io",
  //     url: "https://q.qlogo.cn/g?b=qq&nk=3276327856&s=160",
  //   },
  // ],
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
