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

const FloatMenu: FC<IEditorClickMenuProps> = ({ editor, className, id }) => {
  if (!editor) {
    return null;
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
          <>
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
          </>
        );
      })}
    </BubbleMenu>
  );
};

export default FloatMenu;
