<p align="center">
  <img src="./public/logo.png" alt="ISES 职引" width="80" />
</p>

<h1 align="center">ISES 职引 · 在校生求职平台</h1>

<p align="center">
  <strong>面向高校在校生的一站式求职协作平台</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/License-Private-red" alt="License" />
</p>

---

## 📖 项目简介

**ISES 职引**（原名：即刻短文）是一个为在校大学生打造的求职协作平台，集成了内推信息聚合、企业信息库、薪资查询、实时聊天、富文本创作、个人履历管理等核心功能，帮助学生高效地获取招聘资讯、沟通内推机会，并展示个人竞争力。

## ✨ 核心功能

| 模块 | 说明 |
| --- | --- |
| 🏠 **首页 (Navigator)** | 最新文章流、招聘季节日历、校友人脉速览 |
| 🔍 **发现 (Explore)** | 文章瀑布流浏览、热榜排行、创作者排行 |
| 🤝 **内推 (Referrals)** | 内推信息聚合、按公司/岗位筛选、一键投递 |
| 🏢 **企业信息 (Info)** | 企业库搜索、投递进度管理、多维度筛选 |
| 💬 **聊天 (Chat)** | 基于 GoEasy 的实时消息、文字/图片/语音/表情 |
| ✍️ **发布 (Publish)** | TipTap 富文本编辑器、草稿自动保存、标签分类 |
| 👤 **个人中心 (Profile)** | 履历管理、认证申请、作品展示 |
| 📊 **数据看板 (Dashboard)** | 用户/文章/企业趋势统计、ECharts 可视化 |
| 🎓 **校园 (Campus)** | 校园日历、面经题库等（规划中） |
| 🔧 **管理后台 (Admin)** | 用户管理、企业审核、认证审批 |

## 🎨 设计特点

- **主题色**：统一使用 `#165dff` 蓝色主题，贯穿全局
- **暗黑模式**：支持 Light / Dark 主题切换
- **响应式设计**：适配 PC、平板、手机多端布局
- **无障碍 (a11y)**：关键交互元素均添加 `aria-label`、`tabIndex`、键盘事件支持

## 🛠️ 技术栈

### 核心框架

| 类别 | 技术 |
| --- | --- |
| 前端框架 | [React 18](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) |
| 构建工具 | [Vite 5](https://vitejs.dev/) |
| 路由方案 | [@generouted/react-router](https://github.com/oedotme/generouted)（文件系统路由 + 懒加载） |
| 样式方案 | [TailwindCSS 3](https://tailwindcss.com/) + [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) + [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) |

### UI 组件库

| 库 | 用途 |
| --- | --- |
| [Arco Design](https://arco.design/) | 表格、标签、布局、表单等主力组件 |
| [Mantine](https://mantine.dev/) | 主题系统、通知、部分表单组件 |
| [Radix UI](https://www.radix-ui.com/) | 底层无障碍组件原语 |
| [lucide-react](https://lucide.dev/) | 图标库 |

### 状态管理 & 数据

| 库 | 用途 |
| --- | --- |
| [MobX](https://mobx.js.org/) | User Store、Chat Store |
| [Zustand](https://zustand-demo.pmnd.rs/) | App 全局状态（侧边栏等） |
| [TanStack Query](https://tanstack.com/query) | 服务端数据缓存 & 请求管理 |
| [Axios](https://axios-http.com/) | HTTP 请求（含统一拦截器） |

### 富文本 & 多媒体

| 库 | 用途 |
| --- | --- |
| [TipTap](https://tiptap.dev/) | 富文本编辑器（代码高亮、图片缩放、对齐等） |
| [ECharts](https://echarts.apache.org/) | 数据可视化图表 |
| [GoEasy](https://www.goeasy.io/) | 实时 WebSocket 通信 |
| [js-audio-recorder](https://github.com/nickel-echo/js-audio-recorder) | 语音录制 |
| [react-spring](https://www.react-spring.dev/) | 动画效果 |
| [Yjs](https://yjs.dev/) | 协同编辑支持 |

## 📁 项目结构

```
ISES-fe/
├── public/                     # 静态资源
├── src/
│   ├── api/                    # Axios 实例 & 拦截器
│   ├── assets/                 # 图片等静态资源
│   ├── components/             # 通用组件
│   │   ├── animation/          #   动画组件
│   │   ├── article/            #   文章相关组件
│   │   ├── chat/               #   聊天相关组件
│   │   ├── company-form-modal/ #   企业表单弹窗
│   │   ├── editor/             #   TipTap 编辑器封装
│   │   ├── profile/            #   个人资料组件
│   │   ├── salary-calculator/  #   薪资计算器
│   │   ├── salary-report/      #   薪资报告
│   │   ├── skeleton/           #   骨架屏
│   │   └── toast/              #   消息提示
│   ├── config/                 # API 配置（环境变量驱动）
│   ├── constants/              # 常量定义
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── index.tsx           #   通用 Hook
│   │   ├── useDebounce.tsx     #   防抖 Hook
│   │   └── useDraft.tsx        #   草稿管理 Hook（IndexedDB）
│   ├── pages/                  # 页面（文件系统路由）
│   │   ├── (auth)/             #   认证相关页面
│   │   │   ├── login/          #     登录
│   │   │   ├── register/       #     注册
│   │   │   ├── seekback/       #     找回密码
│   │   │   └── _layout.tsx     #     认证页布局
│   │   ├── navigator/          #   主应用页面
│   │   │   ├── admin/          #     管理后台
│   │   │   ├── campus/         #     校园功能
│   │   │   ├── chat/           #     实时聊天
│   │   │   ├── dashboard/      #     数据看板
│   │   │   ├── explore/        #     发现/浏览
│   │   │   ├── info/           #     企业信息
│   │   │   ├── profile/        #     个人中心
│   │   │   ├── publish/        #     文章发布
│   │   │   ├── referrals/      #     内推信息
│   │   │   ├── components/     #     共享子组件
│   │   │   ├── _layout.tsx     #     主应用布局（侧边栏）
│   │   │   └── index.tsx       #     首页
│   │   ├── 404.tsx             #   404 页面
│   │   └── index.tsx           #   Landing 页面
│   ├── service/                # API 服务层（按业务模块拆分）
│   │   ├── admin/
│   │   ├── article/
│   │   ├── chat/
│   │   ├── company/
│   │   ├── user/
│   │   └── websocket/
│   ├── store/                  # 状态管理
│   │   ├── User.tsx            #   MobX 用户状态
│   │   ├── chat.tsx            #   MobX 聊天状态
│   │   └── index.tsx           #   Zustand 全局状态
│   ├── styles/                 # 全局样式
│   │   ├── home.css            #   首页渐变样式
│   │   └── editor.css          #   编辑器样式
│   ├── types/                  # TypeScript 类型定义
│   ├── utils/                  # 工具函数
│   ├── index.css               # 全局基础样式
│   ├── main.tsx                # 应用入口
│   └── router.ts               # 路由类型生成
├── .env                        # 开发环境变量
├── .env.production             # 生产环境变量
├── tailwind.config.js          # Tailwind 配置
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
├── eslint.config.js            # ESLint 配置
└── package.json
```

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0
- **pnpm** >= 8.0（推荐）

### 安装依赖

```bash
pnpm install
```

### 环境变量配置

在项目根目录创建 `.env` 文件（开发环境）：

```env
# 后端 API 地址
VITE_API_BASE_URL=http://127.0.0.1:3000

# AI 服务地址（可选）
VITE_AI_BASE_URL=
VITE_AI_API_KEY=
```

> 生产环境配置在 `.env.production` 中管理。

### 启动开发服务器

```bash
pnpm dev
```

启动后访问 [http://localhost:5173](http://localhost:5173)。

> Vite 已配置 `/uploads` 路径代理到后端 `http://localhost:3000`，无需额外配置 CORS。

### 构建生产版本

```bash
pnpm build
```

构建产物输出到 `dist/` 目录。

### 预览生产构建

```bash
pnpm preview
```

### 代码检查

```bash
pnpm lint
```

## 🎨 主题定制

### Tailwind 色阶

项目在 `tailwind.config.js` 中定义了完整的 `primary` 色阶：

```js
primary: {
  50:  "#eff6ff",
  100: "#dbeafe",
  200: "#bfdbfe",
  300: "#93c5fd",
  400: "#60a5fa",
  500: "#165dff",  // 主色
  600: "#1252e0",
  700: "#0f47c2",
  800: "#0c3ca3",
  900: "#0a3185",
  DEFAULT: "#165dff",
}
```

使用方式：

```html
<div class="bg-primary text-primary-50 hover:bg-primary-600">按钮</div>
<div class="bg-page">统一页面背景</div>
<div class="shadow-card hover:shadow-card-hover">卡片</div>
```

### 暗黑模式

通过 `localStorage.theme` 控制，支持 `class` 策略切换：

```ts
// 读取主题
const isDark = localStorage.getItem('theme') === 'dark';

// Tailwind 暗黑类
<div className="bg-white dark:bg-theme_dark" />
```

## 📡 API 架构

### 请求层设计

```
config/index.tsx          → API 基础配置（环境变量驱动）
api/index.ts              → Axios 实例 + 请求/响应拦截器
service/{module}/         → 按业务模块拆分的 API 服务函数
hooks/ + TanStack Query   → 页面级数据请求与缓存
```

### 拦截器特性

- **请求拦截**：自动注入 Token（排除公开接口：登录/注册/找回密码等）
- **响应拦截**：统一错误码映射、401 自动清除 Token 并跳转登录页
- **超时处理**：15 秒超时 + 网络异常友好提示

## 📱 响应式断点

| 断点 | 宽度 | 说明 |
| --- | --- | --- |
| `sm` | 600px | 手机横屏 / 小平板 |
| `md` | 900px | 平板 |
| `lg` | 1200px | 笔记本 |
| `slg` | 1800px | 大屏显示器 |

## 🔗 路由结构

项目使用 `@generouted/react-router` 基于文件系统自动生成路由，所有页面均为懒加载：

```
/                        → Landing 落地页
/login                   → 登录
/register                → 注册
/seekback                → 找回密码
/navigator               → 首页（文章流 + 日历 + 人脉）
/navigator/explore       → 发现
/navigator/referrals     → 内推
/navigator/info          → 企业信息
/navigator/chat          → 聊天
/navigator/publish       → 发布文章
/navigator/profile       → 个人中心
/navigator/dashboard     → 数据看板
/navigator/campus        → 校园功能
/navigator/admin         → 管理后台
/*                       → 404
```

## 🤝 开发规范

- **代码风格**：ESLint + TypeScript ESLint + React Hooks 规则
- **CSS 方案**：TailwindCSS 优先，禁止新增 inline style
- **命名规范**：组件 PascalCase、变量/函数 camelCase、常量 UPPER_SNAKE_CASE
- **状态管理**：服务端状态用 TanStack Query，客户端状态用 MobX/Zustand
- **类型安全**：所有 API 响应、组件 Props 必须定义 TypeScript 接口

---

<p align="center">
  <sub>Built with ❤️ by ISES Team</sub>
</p>
