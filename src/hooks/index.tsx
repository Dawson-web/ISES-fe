import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import "@/styles/editor.css";
import { useEffect } from "react";

const defaultContent = `
  <div>开始你的创作...<div>
`;

export const useAritcleEditor = (content?: string, editable: boolean = true) => {
  const editor = useEditor({
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

  // 初始化内容
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return editor;
};