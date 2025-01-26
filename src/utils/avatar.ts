import { apiConfig } from "@/config";

const avatarSplice = (userInfoId: string) => {
  return apiConfig.baseUrl + `/uploads/avatars/${userInfoId}.png`;
};

export default avatarSplice;
