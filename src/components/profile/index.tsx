import { getUserInfo, updateUserInfo } from "@/service/user";
import { Card, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { TextInput, Button } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import UserAvatar from "../public/user_avatar";
import { queryClient } from "@/main";
import { IUpdateUserForm } from "@/types/user";
import { FC } from "react";
import clsx from "clsx";

interface IProps {
  className?: string;
}

const ProfileCard: FC<IProps> = ({ className }) => {
  const { isSuccess, isError, data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getUserInfo(),
  });
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: data?.data.data.username || "",
      email: data?.data.data.User.email || "",
      introduce: data?.data.data.introduce || "",
      school: data?.data.data.school || "",
      createdAt: data?.data.data.createdAt || "",
      id: data?.data.data.id || "",
    },
  });
  const updateProfile = useMutation({
    mutationFn: (v: IUpdateUserForm) =>
      updateUserInfo({
        username: v.username,
        introduce: v.introduce,
        school: v.school,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
  if (isError) return <div>Error</div>;
  if (isSuccess)
    return (
      <Card className={clsx(className, "w-full h-full rounded-lg  ")}>
        <Card.Section className="p-4">
          <UserAvatar src={data.data.data.avatar} size="medium" />
          <form
            onSubmit={form.onSubmit((v) => {
              const form = {
                username: v.username || data.data.data.username,
                introduce: v.introduce || data.data.data.introduce,
                school: v.school || data.data.data.school,
              };
              updateProfile.mutate(form);
            })}
          >
            <div className="grid grid-cols-3 gap-4">
              <TextInput
                mt="sm"
                label="UID"
                key={form.key("id")}
                value={data?.data.data.id}
                disabled
                {...form.getInputProps("id")}
              />
              <TextInput
                mt="sm"
                label="邮箱"
                placeholder="Email"
                disabled
                value={data?.data.data.User.email}
                key={form.key("email")}
                {...form.getInputProps("email")}
              />
              <TextInput
                mt="sm"
                label="创建"
                placeholder="createdAt"
                key={form.key("createdAt")}
                disabled
                value={data?.data.data.createdAt}
                {...form.getInputProps("createdAt")}
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-4 ">
              <TextInput
                label="用户名"
                className="flex-auto "
                placeholder={data?.data.data.username}
                key={form.key("username")}
                {...form.getInputProps("username")}
              />
              <TextInput
                label="学校"
                className="flex-auto"
                key={form.key("school")}
                placeholder={data?.data.data.school || "暂未填写"}
                {...form.getInputProps("school")}
              />
              <Textarea
                label="简介"
                resize="vertical"
                key={form.key("introduce")}
                className="w-full h-auto"
                placeholder={data?.data.data.introduce || "暂未填写"}
                {...form.getInputProps("introduce")}
              />
            </div>
            <Button type="submit" mt="sm" className=" float-right">
              保存
            </Button>
          </form>
        </Card.Section>
      </Card>
    );
};
export default ProfileCard;
