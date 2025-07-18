/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor } from "@tiptap/react";
import { FC } from "react";
import clsx from "clsx";
import { Button, Tooltip } from "@arco-design/web-react";
export interface IMenuItemButtonProps {
  Icon: any;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  className?: any;
  active?: {
    name?: string;
    obj?: any;
  };
  editor?: Editor;
}
const MenuItemButton: FC<IMenuItemButtonProps> = ({
  Icon,
  tooltip,
  onClick,
  disabled,
  className,
  active,
  editor,
}) => {
  type TActive = [string, any];
  const arg = active?.name ? [active.name] : [];
  arg.push(active?.obj as any);

  const isActive = active && editor!.isActive(...(arg as TActive));

  return (
    <Tooltip content={tooltip}>
      <Button
        type={isActive ? "primary" : "default"}
        className={clsx([className])}
        onClick={onClick}
        key={tooltip}
        disabled={disabled}
        aria-label={tooltip}
      >
        {Icon}
      </Button>
    </Tooltip>
  );
};

export default MenuItemButton;
