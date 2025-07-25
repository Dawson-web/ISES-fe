/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor } from "@tiptap/react";
import { FC } from "react";
import clsx from "clsx";
import { Tooltip } from "@mantine/core";
export interface IFloatMenuItemProps {
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
const FloatMenuItem: FC<IFloatMenuItemProps> = ({
  Icon,
  tooltip,
  onClick,
  className,
  active,
  editor,
}) => {
  type TActive = [string, any];
  const arg = active?.name ? [active.name] : [];
  arg.push(active?.obj as any);

  const isActive = active && editor!.isActive(...(arg as TActive));

  return (
    <Tooltip label={tooltip}>
      <div
        className={clsx([className, isActive ? "bg-blue-600 text-white" : "text-black"])}
        onClick={onClick}
        key={tooltip}
        aria-label={tooltip}
      >
        {Icon}
      </div>
    </Tooltip>
  );
};

export default FloatMenuItem;
