import { logout } from "@/api/token";
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import clsx from "clsx";
import { LogOutIcon } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import { Dialog, Button, Badge } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Logout = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();

  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        className={clsx(
          " px-10 gap-8  group sm:my-4 my-6 flex items-end  bg-background dark:bg-theme_dark dark:text-gray-600 text-md font-semibold cursor-pointer 	 "
        )}
      >
        <LogOutIcon />
        <p onClick={toggle}>登出</p>

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
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};
