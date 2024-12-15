"use client";
import {
  Alert,
  Button,
  PasswordInput,
  PinInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { useState } from "react";
import AppLogo from "../../../components/public/app-logo";
import { Bell, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { register, sendEmailCode } from "../../../service";
import { toast } from "sonner";
import { IRegisterFileds } from "../../../types";

export default function Page() {
  const [stage, setStage] = useState<"fill" | "verify" | "done">("fill");

  const form = useForm<IRegisterFileds>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      _confirmPassword: "",
      emailCode: "",
    },
    validate: {
      email: (value) => (!/^\S+@\S+$/.test(value) ? "请输入正确的邮箱" : null),
      _confirmPassword: (value, values) =>
        value !== values.password ? "密码不一致" : null,
    },
  });

  return (
    <div className=" flex flex-col items-center gap-8">
      <div className="flex items-center gap-2">
        <AppLogo />
        <div className="font-comfortaa text-xl font-semibold">| 注册</div>
      </div>

      <div className="relative flex w-[30vw] min-w-[320px] max-w-[400px]  flex-col items-center gap-2 overflow-hidden rounded-md border bg-white p-4 shadow-md">
        <form
          className="w-full"
          onSubmit={form.onSubmit(async (v) => {
            console.log(v);
            await sendEmailCode(v.email);
            setStage("verify");
          })}
        >
          {stage === "fill" && (
            <div className="flex flex-col gap-2">
              <TextInput
                id="email"
                label="邮箱"
                key={form.key("email")}
                {...form.getInputProps("email")}
              />
              <PasswordInput label="密码" {...form.getInputProps("password")} />
              <PasswordInput
                label="确认密码"
                {...form.getInputProps("_confirmPassword")}
              />

              <Link to="/login" className="text-xs opacity-50 hover:opacity-75">
                已有账号？前往登录
              </Link>

              <Button className="mt-4" variant="light" type="submit">
                下一步
              </Button>
            </div>
          )}

          {stage === "verify" && (
            <div className="flex flex-col">
              <Alert color="blue" icon={<Bell />} title="需要验证">
                验证邮件已发送至 {form.getValues().email}
              </Alert>
              <PinInput
                className="my-10 justify-center"
                length={7}
                key={form.key("emailCode")}
                {...form.getInputProps("emailCode")}
              />
              <Button
                onClick={async () => {
                  try {
                    await register(form.getValues()).then(() => {
                      setStage("done");
                    });
                  } catch (error) {
                    toast(String(error));
                  }
                }}
                className="mt-4"
              >
                注册
              </Button>
            </div>
          )}
        </form>

        {stage === "done" && (
          <div className="flex w-full flex-col items-center p-8">
            <Check size={48} className="text-theme_blue" />
            <div className="mt-2 font-light">注册成功</div>
            <Button component={Link} to="/login" className="mt-8">
              继续
            </Button>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 h-1 bg-theme_blue"></div>
      </div>
    </div>
  );
}
