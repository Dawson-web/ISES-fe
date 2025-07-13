import { Editor, BubbleMenu } from "@tiptap/react";
import { FC } from "react";
import getFloatMenuItemGroups from "./data/floatmenuItemGroup";
import FloatMenuItem from "./FloatMenuItem";

interface IEditorClickMenuProps {
  editor: Editor | null;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  extend?: any;
  className?: string;
  id: string;
}

const FloatMenu: FC<IEditorClickMenuProps> = ({ editor }) => {
  if (!editor) {
    return <>悬浮菜单Not Fount......</>;
  }
  const menuItemGroups = getFloatMenuItemGroups(editor);

  return (
    <BubbleMenu
      className="bubble-menu flex flex-row flex-nowrap  bg-theme_gray rounded-md  shadow-xl"
      tippyOptions={{ duration: 100 }}
      editor={editor}
    >
      {menuItemGroups.map((group) => {
        return (
          <div key={group[0].tooltip} className="flex flex-row flex-nowrap">
            {group.map((itemProps, i) => (
              <FloatMenuItem
                {...itemProps}
                key={itemProps.tooltip + i}
                editor={editor}
                className={
                  "bg-theme_gray hover:bg-gray-700  rounded-md flex justify-center items-center p-1 hover:"
                }
              />
            ))}
          </div>
        );
      })}
    </BubbleMenu>
  );
};

export default FloatMenu;
