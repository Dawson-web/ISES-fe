"use client";

import clsx from "clsx";
import { apiConfig } from "@/config";
import { FC } from "react";
import { uploadAvatar } from "../../../service/user";
import { toastMessage } from "@/components/toast";

interface Props {
  src?: string;
  size: "small" | "medium" | "large";
  className?: string;
  disabled?: boolean;
}

const UserAvatar: FC<Props> = ({ src, size, className, disabled = false }) => {
  const avatarUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      console.log(file.fieldname, file);
      const formData = new FormData();
      formData.append("avatar", file);
      await uploadAvatar(formData)
        .then(() => {
          window.location.reload();
          toastMessage.success("头像上传成功");
        })
        .catch((err) => {
          toastMessage.error(String(err));
        });
    };
  };
  return (
    <div className={className}>
      <div
        className={clsx("relative w-[60px] h-[60px] ", {
          "w-[40px] h-[40px]": size === "small",
          "w-[60px] h-[60px]": size === "medium",
          "w-[80px] h-[80px]": size === "large",
        })}
        onClick={() => {
          if (!disabled) avatarUpload();
        }}
      >
        <img
          src={
            apiConfig.baseUrl + src ||
            "https://www.betula.space/images/avatar.png"
          }
          alt="avatar"
          className={clsx("relative w-[60px] h-[60px] rounded-full ", {
            "w-[40px] h-[40px]": size === "small",
            "w-[60px] h-[60px]": size === "medium",
            "w-[80px] h-[80px]": size === "large",
          })}
        />
        <div
          className={clsx(
            "bg-green-500 border-white border-4 rounded-full w-[20px] h-[20px] absolute bottom-[0px] right-[0px]",
            {
              "w-[12px] h-[12px] border-1": size === "small",
            }
          )}
        ></div>
      </div>
    </div>
  );
};

export default UserAvatar;
