export const apiConfig = {
  baseUrl: "http://127.0.0.1:3000",
  // baseUrl: window.location.protocol + "//43.139.172.162:3000",
  unProtectedUrls: ["/login", "/captcha", "/signup", "/email", "/seekback"],
};

export const aiConfig = {
  baseUrl: "https://api2.aigcbest.top/v1",
  apiKey: import.meta.env.VITE_AI_API_KEY || null,
};
