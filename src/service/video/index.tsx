// import { getValidToken } from "@/api/token";
// import Hls from "hls.js";

// // 创建 Hls 实例
// const hls = new Hls();

// // 获取 token，这里假设 token 存储在 localStorage 中
// const token = getValidToken();

// // 自定义加载器，添加请求头
// hls.config.loader = function (config) {
//   const defaultLoader = Hls.DefaultConfig.loader;
//   const newConfig = {
//     ...config,
//     headers: {
//       Authorization: `Bearer ${token}`, // 添加 token 到请求头
//     },
//   };
//   return new defaultLoader(newConfig);
// };

// export default hls;
