import { apiConfig } from "@/config";

const avatarSplice = (src: string) => {
  return apiConfig.baseUrl + `${src}`;
};

export default avatarSplice;
