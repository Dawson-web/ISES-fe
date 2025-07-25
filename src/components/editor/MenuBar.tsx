import { Card } from "@arco-design/web-react";
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
    <Card className="w-full ">
      <div className="flex flex-row gap-2 rounded-md  justify-center overflow-x-auto pb-1">
        {menuItemGroups.map((group) => {
          return (
            <div key={group[0].tooltip} className="flex flex-row gap-1">
              {group.map((itemProps, i) => (
                <MenuItemButton
                  {...itemProps}
                  key={itemProps.tooltip + i}
                  editor={editor}
                  className={"p-[0.5em] rounded-md "}
                />
              ))}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default MenuBar;
