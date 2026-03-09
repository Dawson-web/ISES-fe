export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000',
  unProtectedUrls: ['/login', '/captcha', '/signup', '/email', '/seekback'],
};

export const aiConfig = {
  baseUrl: import.meta.env.VITE_AI_BASE_URL || '',
  apiKey: import.meta.env.VITE_AI_API_KEY || null,
};
