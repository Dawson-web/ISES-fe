import { logout } from "@/api/token";
import clsx from "clsx";
import { Dialog, Button, Badge } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FC } from "react";
interface IProps {
  className?: string;
  opened: boolean;
  close: () => void;
}
export const Logout: FC<IProps> = ({ className, opened, close }) => {
  const navigate = useNavigate();

  return (
    <div className={clsx(className)}>
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
