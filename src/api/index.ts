import axios from "axios";
import { apiConfig } from "../config";
import { getValidToken } from "./token";

export const $axios = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: 5000,
});

$axios.interceptors.request.use(
  (config) => {
    const url = config.url;

    if (url && !apiConfig.unProtectedUrls.some((x) => url.startsWith(x))) {
      config.headers.token = getValidToken();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

$axios.interceptors.response.use(
  (response) => {
    const code = response.status; // 注意这里使用 response.status 获取 HTTP 状态码
    
    switch (true) {
      case code >= 200 && code < 300: {
        if (!response.data.status) {
          return Promise.reject(new Error(`${response.data.message}`));
        }
        return response;
      }
      case code === 400: // Bad Request
        return Promise.reject(new Error(`请求错误: ${code}`));
      case code === 401: // Unauthorized
        return Promise.reject(new Error(`未授权: ${code}`));
      case code === 403: // Forbidden
        return Promise.reject(new Error(`禁止访问: ${code}`));
      case code === 404: // Not Found
        return Promise.reject(new Error(`未找到资源: ${code}`));
      case code === 405: // Method Not Allowed
        return Promise.reject(new Error(`方法不允许: ${code}`));
      case code === 415: // Unsupported Media Type
        return Promise.reject(new Error(`不支持的媒体类型: ${code}`));
      case code >= 400 && code < 500:
        return Promise.reject(new Error(`客户端错误: ${code}`));
      case code >= 500 && code < 600:
        return Promise.reject(new Error(`服务器错误: ${code}`));
      default:
        return Promise.reject(new Error(`未知错误: ${code}`));
    }
  },
  (error) => Promise.reject(error)
);
