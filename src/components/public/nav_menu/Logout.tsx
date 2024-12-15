import { logout } from "@/api/token";
import clsx from "clsx";
import { LogOutIcon } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import { Dialog, Button, Badge } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FC } from "react";
interface IProps {
  className?: string;
}
export const Logout: FC<IProps> = ({ className }) => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();

  return (
    <div onClick={toggle} className={clsx(className)}>
      <div className="text-nowrap flex gap-8">
        <LogOutIcon />
        登出
      </div>

      <Dialog
        opened={opened}
        withCloseButton
        onClose={close}
        size="lg"
        radius="md"
        className="dark:bg-theme_dark dark:text-gray-600"
      >
        <Badge color="yellow" variant="filled">
          注意
        </Badge>
        <div className="flex  flex-nowrap justify-between mt-4 ">
          <p className=" font-semibold">是否确认退出当前账号？</p>
          <Button
            onClick={async () => {
              close();
              await logout();
              navigate("/login");
              toast.success("退出成功");
            }}
            className="bg-theme_blue "
          >
            确认
          </Button>
        </div>
      </Dialog>
    </div>
  );
};
