import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import { Badge, Card, Container, Input, Select } from "@mantine/core";
import "../../styles/editor.css";
import SideTip from "../article/side-tip";
import { useState } from "react";
import { IArticleFiled } from "@/types/article";

const defaultContent = `
  <div>开始你的创作...<div>
`;
export const useAritcleEditor = (content?: string, editable: boolean = true) =>
  useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Image,
    ],
    content: content || defaultContent,
    editable: editable,
  }) as Editor;

const IeseEditor = () => {
  const editor = useAritcleEditor(``);

  const [article, setArticle] = useState<IArticleFiled>({
    title: "",
    content: editor?.getHTML() as string,
    type: "日常",
  });

  return (
    <div className="flex flex-wrap gap-y-4 md:gap-x-4 h-full w-full " id="post">
      <div className="flex-auto flex flex-col gap-4">
        <MenuBar editor={editor} />

        <Card className=" rounded-lg p-4 mt-2 dark:bg-theme_dark border border-gray-300 dark:border-gray-600 dark:text-white  overflow-hidden flex flex-col gap-4 flex-1">
          <div className="flex  gap-4 nowrap ">
            <div className="flex-1">
              <Badge className="text-[1rem] bg-theme_blue">标题</Badge>
              <Input
                className="text-center mt-1 min-w-[200px] "
                placeholder="Title"
                onChange={(e) =>
                  setArticle({ ...article, title: e.target.value })
                }
              ></Input>
            </div>
            <Select
              label="类型"
              placeholder="Pick value"
              defaultValue={"日常"}
              onChange={(e) => setArticle({ ...article, type: e })}
              data={["日常", "分享", "感悟", "学习"]}
            />
          </div>
          <Badge className="text-[1rem] bg-theme_blue p-2">文章</Badge>
          <Container className="border border-gray-300 dark:border-gray-600 rounded-lg w-full mx-0 p-0 h-full flex flex-col [&>div]:flex-1 [&>div>div]:h-full   ">
            <EditorContent editor={editor} placeholder="开始你的编辑吧！" />
          </Container>
        </Card>
      </div>
      <SideTip
        article={article}
        editor={editor}
        className="flex-1 min-w-[300px]"
      />
    </div>
  );
};

export default IeseEditor;
