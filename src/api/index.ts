import axios from 'axios';
import { apiConfig } from '../config';
import { getValidToken } from './token';

const ERROR_MESSAGES: Record<number, string> = {
  400: '请求参数有误',
  401: '登录已过期，请重新登录',
  403: '暂无权限访问',
  404: '请求的资源不存在',
  405: '请求方法不被允许',
  408: '请求超时',
  415: '不支持的媒体类型',
  429: '请求过于频繁，请稍后再试',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂不可用',
  504: '网关超时',
};

export const $axios = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: 15000,
});

// 请求拦截器
$axios.interceptors.request.use(
  (config) => {
    const url = config.url;

    if (url && !apiConfig.unProtectedUrls.some((x) => url.startsWith(x))) {
      const token = getValidToken();
      if (token) {
        config.headers.token = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器
$axios.interceptors.response.use(
  (response) => {
    // 业务状态码检查
    if (!response.data.status) {
      return Promise.reject(new Error(response.data.message || '请求失败'));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      const message = ERROR_MESSAGES[status] || `请求失败 (${status})`;

      // 401 自动清除 token 并跳转登录页
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        // 避免在登录页重复跳转
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      return Promise.reject(new Error(message));
    }

    // 网络错误 / 超时
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('请求超时，请检查网络后重试'));
    }

    return Promise.reject(new Error('网络异常，请检查网络连接'));
  },
);
