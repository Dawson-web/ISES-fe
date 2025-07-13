import  { useAritcleEditor } from "@/hooks";
import FloatMenu from "@/components/editor/FloatMenu";
import MenuBar from "@/components/editor/MenuBar";
import {
  Badge,
  Card,
} from "@mantine/core";
import { EditorContent } from "@tiptap/react";
import clsx from "clsx";
import { FC, useRef } from "react";

interface IProps {
  content: string;
  className?: string;
  editable?: boolean;
  showMenu?: boolean;
  showEdit?: boolean;
  title?: string;
  type?: string;
}

const ArticlePreview: FC<IProps> = ({
  content,
  className,
  editable = false,
  showMenu = false,
  title,
}) => {
  const editor = useAritcleEditor(content, editable);
  const editorRef = useRef(null);

  return (
    <Card
      className={clsx(
        className,
        "rounded-lg border-0 shadow-none flex flex-col gap-4"
      )}
    >
      <div className="flex-auto flex flex-col gap-4">

        {title == "" ? (
          <Badge className="text-[1rem] bg-theme_blue p-2">文章</Badge>
        ) : (
          <div className="text-2xl font-bold">文章:&nbsp;{title}</div>
        )}
        {showMenu && <MenuBar editor={editor} />}
        <Card className="overflow-visible  rounded-lg w-full mx-0 p-0 h-full flex flex-col flex-1 gap-2 [&>Card]:flex-1 [&>div>div]:flex-1">
          <EditorContent
            id="edit"
            editor={editor}
            placeholder="开始你的编辑吧！"
            ref={editorRef}
          />
          {editor && <FloatMenu editor={editor} id="click-menu" />}
        </Card>
      </div>
    </Card>
  );
};

export default ArticlePreview;