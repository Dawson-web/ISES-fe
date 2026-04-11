"use client";

import clsx from "clsx";
import { apiConfig } from "@/config";
import { FC } from "react";
import { uploadAvatar } from "../../../service/user";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toastMessage } from "@/components/toast";
import { useState } from "react";
import { User } from "lucide-react";

interface Props {
  src?: string;
  size: "small" | "medium" | "large";
  className?: string;
  disabled?: boolean;
}

const UserAvatar: FC<Props> = ({ src, size, className, disabled = false }) => {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | undefined>(src);
  const { mutate: mutateUserInfo } = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (res) => {
      setPreview(res.data.data.avatar);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toastMessage.success("头像上传成功");
    },
  });

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
      try {
        mutateUserInfo(formData);
      } catch (err) {
        toastMessage.error(String(err));
      }
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
        {preview ? (
          <img
            src={apiConfig.baseUrl + preview}
            alt="avatar"
            className={clsx("relative w-[60px] h-[60px] rounded-full object-cover ", {
              "w-[40px] h-[40px]": size === "small",
              "w-[60px] h-[60px]": size === "medium",
              "w-[80px] h-[80px]": size === "large",
            })}
          />
        ) : (
          <div
            className={clsx(
              "relative w-[60px] h-[60px] rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center",
              {
                "w-[40px] h-[40px]": size === "small",
                "w-[60px] h-[60px]": size === "medium",
                "w-[80px] h-[80px]": size === "large",
              }
            )}
          >
            <User
              className={clsx({
                "w-4 h-4": size === "small",
                "w-6 h-6": size === "medium",
                "w-8 h-8": size === "large",
              })}
            />
          </div>
        )}
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
