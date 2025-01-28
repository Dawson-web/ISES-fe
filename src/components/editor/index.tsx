import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import { Badge, Card, Container, Input, Select } from "@mantine/core";
import "../../styles/editor.css";
import SideTip from "../article/side-tip";
import { FC, useEffect, useRef, useState } from "react";
import { IArticleFiled } from "@/types/article";
import ImageResize from "tiptap-extension-resize-image";
import clsx from "clsx";
import FloatMenu from "./FloatMenu";

interface IProps {
  className?: string;
}

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
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      ImageResize.configure({}),
    ],
    content: content || defaultContent,
    editable: editable,
  }) as Editor;

const IeseEditor: FC<IProps> = ({ className }) => {
  const editor = useAritcleEditor(``);
  const editorRef = useRef(null);
  const [article, setArticle] = useState<IArticleFiled>({
    title: "",
    content: editor?.getHTML() as string,
    type: "日常",
  });

  // 处理粘贴图片
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (clipboardData) {
        const items = clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf("image") !== -1) {
            // 如果是图片类型数据，进行处理插入编辑器
            const file = item.getAsFile();
            if (file) {
              // 这里需要将文件转换为Base64编码或者上传到服务器获取图片URL后插入编辑器
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64Data = reader.result;
                if (base64Data) {
                  editor.commands.setImage({
                    src: base64Data as string,
                  });
                }
              };
              reader.readAsDataURL(file);
            }
          }
        }
      }
    };
    if (editorRef.current) {
      editorRef.current.addEventListener("paste", handlePaste);
    }
    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("paste", handlePaste);
      }
    };
  }, [editor]);

  // useEffect(() => {
  //   const Edit = document.getElementById("edit");
  //   console.log("Edit", Edit);
  //   Edit.onselect = (e) => {
  //     const selection = window.getSelection();
  //     if (selection) {
  //       const range = selection.getRangeAt(0);
  //       const rect = range.getBoundingClientRect();
  //       setPosition({ x: rect.left, y: rect.top });
  //       setOpen(true);
  //     }
  //     console.log("onselect", e);
  //   };
  // });

  return (
    <div
      className={clsx(
        className,
        "flex flex-wrap gap-y-4 md:gap-x-4 h-full w-full  "
      )}
      id="post"
    >
      <div className="flex-auto flex flex-col gap-4">
        <MenuBar editor={editor} />

        <Card className=" rounded-lg p-4 mt-2 border   overflow-hidden flex flex-col gap-4 flex-1">
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
          <Container className="border rounded-lg w-full mx-0 p-0 h-full flex flex-col [&>div]:flex-1 [&>div>div]:h-full   ">
            <EditorContent
              id="edit"
              editor={editor}
              placeholder="开始你的编辑吧！"
              ref={editorRef}
            />
            {editor && <FloatMenu editor={editor} id="click-menu" />}
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
