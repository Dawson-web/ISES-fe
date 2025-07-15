import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import { Card } from "@arco-design/web-react";
import "../../styles/editor.css";
import { FC, useEffect, useRef } from "react";
import ImageResize from "tiptap-extension-resize-image";
import clsx from "clsx";
import FloatMenu from "./FloatMenu";
import { isMobile } from "@/utils";

interface IProps {
    className?: string;
    editor?: Editor;
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

const IeseEditor: FC<IProps> = ({ className, editor: propEditor }) => {
    const editor = propEditor || useAritcleEditor(``);
    const editorRef = useRef(null);

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
            // @ts-ignore
            editorRef.current?.addEventListener("paste", handlePaste);
        }
        return () => {
            if (editorRef.current) {
                // @ts-ignore
                editorRef.current?.removeEventListener("paste", handlePaste);
            }
        };
    }, [editor]);
    // 只在挂载时读取数据库


    return (
        <div
            className={clsx(
                className,
                "flex flex-wrap gap-y-4 md:gap-x-4 h-full w-full  "
            )}
            id="post"
        >
            <div className="flex-auto flex flex-col gap-4">
                {!propEditor && <MenuBar editor={editor} />}

                <Card className=" rounded-lg p-4 mt-2 border   overflow-hidden flex flex-col gap-4 flex-1">
                    <EditorContent
                        id="edit"
                        editor={editor}
                        placeholder="开始你的编辑吧！"
                        ref={editorRef}
                        className="text-black"
                    />
                    {isMobile() && editor && <FloatMenu editor={editor} id="click-menu" />}
                </Card>
            </div>
        </div>
    );
};

export default IeseEditor;
