"use client";
import {
  Alert,
  Button,
  Input,
} from "@arco-design/web-react";

import { useState } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import AppLogo from "../../../components/public/app-logo";
import { seekback, sendEmailCode } from "../../../service";
import { toast } from "sonner";
import { ISeekBackFileds } from "../../../types";

export default function Page() {
  const [stage, setStage] = useState<"fill" | "verify" | "done">("fill");
  const [formData, setFormData] = useState<ISeekBackFileds>({
    email: "",
    password: "",
    emailCode: "",
  });
  const [errors, setErrors] = useState<Partial<ISeekBackFileds>>({});

  const validateForm = () => {
    const newErrors: Partial<ISeekBackFileds> = {};
    
    if (!formData.email) {
      newErrors.email = "请输入邮箱";
    } else if (!/^\S+@\S+$/.test(formData.email)) {
      newErrors.email = "请输入正确的邮箱";
    }
    
    if (!formData.password) {
      newErrors.password = "请输入新密码";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ISeekBackFileds, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await sendEmailCode(formData.email);
      setStage("verify");
    } catch (error) {
      toast(String(error));
    }
  };

  const handleSeekback = async () => {
    try {
      await seekback(formData).then(() => {
        setStage("done");
      });
    } catch (error) {
      toast(String(error));
    }
  };

  return (
    <div>

      <AppLogo size="18px" title="ISES" subtitle="找回" />

      <div className="relative flex w-[30vw] min-w-[320px] max-w-[400px] flex-col items-center gap-2 overflow-hidden rounded-md dark:bg-theme_dark p-4 shadow-md mt-4">
        <form
          className="w-full"
          onSubmit={handleSubmit}
        >
          {stage === "fill" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">邮箱</label>
                <Input
                  placeholder="请输入邮箱"
                  value={formData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  status={errors.email ? "error" : undefined}
                />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">新密码</label>
                <Input.Password
                  placeholder="请输入新密码"
                  value={formData.password}
                  onChange={(value) => handleInputChange("password", value)}
                  status={errors.password ? "error" : undefined}
                />
                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
              </div>

              <Link to="/login" className="text-xs opacity-50 hover:opacity-75">
                已有账号？前往登录
              </Link>

              <Button className="mt-4" type="outline" htmlType="submit">
                下一步
              </Button>
            </div>
          )}

          {stage === "verify" && (
            <div className="flex flex-col gap-4">
              <Alert type="info" content={`验证邮件已发送至 ${formData.email}`} />
              
              <div className="my-10 flex justify-center">
                <Input
                  placeholder="请输入7位验证码"
                  value={formData.emailCode}
                  onChange={(value) => handleInputChange("emailCode", value)}
                  maxLength={7}
                  className="text-center"
                />
              </div>
              
              <Button
                type="primary"
                onClick={handleSeekback}
              >
                找回
              </Button>
            </div>
          )}
        </form>

        {stage === "done" && (
          <div className="flex w-full flex-col items-center p-8">
            <Check size={48} className="text-theme_blue" />
            <div className="mt-2 font-light">密码重置成功</div>
            <Link to="/">
              <Button type="primary" className="mt-8">
                继续
              </Button>
            </Link>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 h-1 bg-theme_blue"></div>
      </div>
    </div>
  );
}
