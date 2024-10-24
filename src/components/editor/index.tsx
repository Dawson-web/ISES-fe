import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import { Badge, Card, Container, Input, Select } from "@mantine/core";
import "../../styles/editor.css";
import SideTip from "../side-tip";
import { useState } from "react";
import { IArticleFiled } from "@/types/article";

const defaultContent = `
  <div>题目内容描述...<div>
`;
export const useAritcleEditor = (content?: string) =>
  useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: content || defaultContent,
  }) as Editor;

const IeseEditor = () => {
  const editor = useAritcleEditor(`<p>...ss..</p>`);

  const [article, setArticle] = useState<IArticleFiled>({
    title: "",
    content: editor?.getHTML() as string,
    type: "日常",
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4">
      <div className="col-span-2 ">
        <MenuBar editor={editor} />

        <Card className="rounded-lg p-4 mt-2 dark:bg-theme_dark border border-gray-300 dark:border-gray-600 dark:text-white  overflow-hidden flex flex-col gap-4 h-full">
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
          <Badge className="text-[1rem] bg-theme_blue mt-4">文章</Badge>
          <Container className="border border-gray-300 dark:border-gray-600 rounded-lg w-full mx-0 p-0 ">
            <EditorContent editor={editor} />
          </Container>
        </Card>
      </div>
      <SideTip article={article} editor={editor} />
    </div>
  );
};

export default IeseEditor;
