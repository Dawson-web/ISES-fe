import clsx from "clsx";
import { useState } from "react";
import Form from "../form";
import LinkCard from "../chat/friend_card";
import ImgCard from "../public/img_card";
import { useForm } from "@mantine/form";
import { formConfig } from "../../config";

interface Filedls {
  email: string;
  password: string;
  age: number;
  img: File | null;
  termsOfService: boolean;
}

export default function RenderComponents() {
  const [component, setComponent] = useState("form");

  const form = useForm<Filedls>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      age: 0,
      img: null,
      termsOfService: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "请输入正确的邮箱"),
      termsOfService: (value) => (value ? null : "请同意服务条款"),
    },
  });
  const fn = (v: Filedls) => {
    console.log(v);
  };

  return (
    <div>
      <div className="w-full min-w-[320px] h-full flex flex-col items-center justify-center bg-gray-300 rounded-md px-4 py-2">
        <ul className="flex gap-4 font-bold text-lg  cursor-default ">
          <li
            onClick={() => setComponent("form")}
            className={clsx("px-2 py-1", {
              " bg-theme_blue rounded-lg ": component === "form",
            })}
          >
            表单
          </li>
          <li
            onClick={() => setComponent("img_card")}
            className={clsx("px-2 py-1", {
              " bg-theme_blue rounded-lg ": component === "img_card",
            })}
          >
            图片卡片
          </li>
          <li
            onClick={() => setComponent("link_card")}
            className={clsx("px-2 py-1", {
              " bg-theme_blue rounded-lg ": component === "link_card",
            })}
          >
            友链卡片
          </li>
        </ul>
      </div>
      <div className="mt-[20px]    h-full flex flex-col items-center justify-center rounded-md p-2">
        {component === "form" && (
          <Form form_config={formConfig.maintenanceForm} form={form} fn={fn} />
        )}
        {component === "img_card" && <ImgCard />}
        {component === "link_card" && <LinkCard />}
      </div>
    </div>
  );
}
