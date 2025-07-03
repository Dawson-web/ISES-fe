"use client";
import {
  Alert,
  Button,
  Input,
  Typography,
  VerificationCode,
} from "@arco-design/web-react";
import { Check } from "lucide-react";

import { useState } from "react";
import AppLogo from "../../../components/public/app-logo";
import { Link } from "react-router-dom";
import { register, sendEmailCode } from "../../../service";
import { toast } from "sonner";
import { IRegisterFileds } from "../../../types";

export default function Page() {
  const [stage, setStage] = useState<"fill" | "verify" | "done">("fill");
  const [formData, setFormData] = useState<IRegisterFileds>({
    email: "",
    password: "",
    _confirmPassword: "",
    emailCode: "",
  });
  const [errors, setErrors] = useState<Partial<IRegisterFileds>>({});

  const validateForm = () => {
    const newErrors: Partial<IRegisterFileds> = {};
    
    if (!formData.email) {
      newErrors.email = "请输入邮箱";
    } else if (!/^\S+@\S+$/.test(formData.email)) {
      newErrors.email = "请输入正确的邮箱";
    }
    
    if (!formData.password) {
      newErrors.password = "请输入密码";
    }
    
    if (!formData._confirmPassword) {
      newErrors._confirmPassword = "请确认密码";
    } else if (formData._confirmPassword !== formData.password) {
      newErrors._confirmPassword = "密码不一致";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof IRegisterFileds, value: string) => {
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
      toast.success(`验证邮件已发送至 ${formData.email}`);
      setStage("verify");
    } catch (error) {
      toast.error(String(error));
    }
  };

  const handleRegister = async () => {
    if (!formData.emailCode) {
      toast.error("请输入验证码");
      return;
    }

    try {
      await register(formData);
      setStage("done");
      toast.success("注册成功");
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <div>
      <AppLogo size="18px" title="ISES" subtitle="注册" />

      <div className="relative flex w-[30vw] min-w-[320px] max-w-[400px] flex-col items-center gap-2 overflow-hidden rounded-md p-4 shadow-md mt-4">
        {stage === "fill" && (
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">邮箱</label>
                <Input
                  placeholder="请输入邮箱"
                  value={formData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  status={errors.email ? "error" : undefined}
                />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">密码</label>
                <Input.Password
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(value) => handleInputChange("password", value)}
                  status={errors.password ? "error" : undefined}
                />
                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">确认密码</label>
                <Input.Password
                  placeholder="请确认密码"
                  value={formData._confirmPassword}
                  onChange={(value) => handleInputChange("_confirmPassword", value)}
                  status={errors._confirmPassword ? "error" : undefined}
                />
                {errors._confirmPassword && <div className="text-red-500 text-xs mt-1">{errors._confirmPassword}</div>}
              </div>

              <Link to="/login" className="text-xs opacity-50 hover:opacity-75">
                已有账号？前往登录
              </Link>

              <Button className="mt-4" type="outline" htmlType="submit">
                下一步
              </Button>
            </div>
          </form>
        )}

        {stage === "verify" && (
          <div className="flex flex-col gap-4 w-full">
            <Typography.Title heading={5} style={{ textAlign: 'center', margin: 0 }}>
              请输入验证码
            </Typography.Title>
            
            <Alert 
              type="info" 
              content={`验证邮件已发送至 ${formData.email}`} 
              style={{ marginBottom: '20px' }}
            />
            
            <div className="flex justify-center my-6">
              <VerificationCode 
                size="large" 
                length={7} 
                validate={({inputValue}) => /^[a-zA-Z0-9]*$/.test(inputValue) ? inputValue.toLowerCase() : false} 
                onChange={(value) => handleInputChange("emailCode", value)}
              />
            </div>
            
            <Button 
              type="primary" 
              size="large" 
              onClick={handleRegister}
              className="mt-4"
              disabled={!formData.emailCode || formData.emailCode.length !== 7}
            >
              注册
            </Button>
          </div>
        )}

        {stage === "done" && (
          <div className="flex w-full flex-col items-center p-8">
            <Check size={48} className="text-blue-500" />
            <div className="mt-2 font-light">注册成功</div>
            <Link to="/login">
              <Button type="primary" className="mt-8">
                前往登录
              </Button>
            </Link>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 h-1 bg-blue-500"></div>
      </div>
    </div>
  );
}
