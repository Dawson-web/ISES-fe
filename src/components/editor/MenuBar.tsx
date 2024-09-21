import getMenuItemGroups from "./data/menuItemGroup";
import MenuItemButton from "./EditorMenuItemButton";
import { Editor } from "@tiptap/react";
import { FC } from "react";

interface IEditorMenuBarProps {
  editor: Editor | null;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  extend?: any;
}

const MenuBar: FC<IEditorMenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const menuItemGroups = getMenuItemGroups(editor);
  return (
    <div className="w-[100%] flex gap-2 flex-wrap bg-gray-00 p-2 rounded-md bg-white">
      {menuItemGroups.map((group) => {
        return (
          <>
            {group.map((itemProps, i) => (
              <MenuItemButton
                {...itemProps}
                key={itemProps.tooltip + i}
                editor={editor}
                className={
                  "bg-blue-600 hover:bg-blue-700 p-[0.5em] rounded-md text-white"
                }
              />
            ))}
          </>
        );
      })}
    </div>
  );
};

export default MenuBar;