import { Card } from "@mantine/core";
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
    <Card className="w-full flex flex-row gap-2 flex-wrap bg-gray-00 p-2 rounded-md  justify-center">
      {menuItemGroups.map((group) => {
        return (
          <>
            {group.map((itemProps, i) => (
              <MenuItemButton
                {...itemProps}
                key={itemProps.tooltip + i}
                editor={editor}
                className={"p-[0.5em] rounded-md "}
              />
            ))}
          </>
        );
      })}
    </Card>
  );
};

export default MenuBar;
