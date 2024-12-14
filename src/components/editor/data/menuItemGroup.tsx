import {
  CodeIcon,
  CodeSquareIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Image,
  ItalicIcon,
  List,
  ListOrdered,
  LucideBold,
  MessageSquareQuote,
  MinusIcon,
  Pilcrow,
  Redo2Icon,
  RemoveFormatting,
  StrikethroughIcon,
  Undo2Icon,
  WrapTextIcon,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { ReactElement } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/service/article";
import { apiConfig } from "@/config";

export interface IMenuItemButtonProps {
  Icon: ReactElement;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  active?: {
    name?: string;
    obj?: any;
  };
}

type TEditorGroup = Array<IMenuItemButtonProps>;

const getMenuItemGroups = (editor: Editor) => {
  const editorItemsGroup1: TEditorGroup = [
    {
      tooltip: "加粗",
      Icon: <LucideBold size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      active: {
        name: "bold",
      },
    },
    {
      tooltip: "斜体",
      Icon: <ItalicIcon size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      active: {
        name: "italic",
      },
    },
    {
      tooltip: "删除线",
      Icon: <StrikethroughIcon size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      active: {
        name: "strike",
      },
    },
    {
      tooltip: "code",
      Icon: <CodeIcon size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      active: {
        name: "code",
      },
    },
  ];

  const editorItemsGroup2: TEditorGroup = [
    {
      tooltip: "Heading1",
      Icon: <Heading1Icon size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: {
        name: "heading",
        obj: { level: 1 },
      },
    },
    {
      tooltip: "Heading2",
      Icon: <Heading2Icon size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: {
        name: "heading",
        obj: { level: 2 },
      },
    },
    {
      tooltip: "Heading3",
      Icon: <Heading3Icon size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: {
        name: "heading",
        obj: { level: 3 },
      },
    },
    {
      tooltip: "段落",
      Icon: <Pilcrow size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().setParagraph().run(),
      active: {
        name: "paragraph",
      },
    },
    {
      tooltip: "列表",
      Icon: <List size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: {
        name: "bulletList",
      },
    },
    {
      tooltip: "有序列表",
      Icon: <ListOrdered size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      active: {
        name: "orderedList",
      },
    },
    {
      tooltip: "代码段",
      Icon: <CodeSquareIcon size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      active: {
        name: "codeBlock",
      },
    },
  ];

  const editorItemsGroup3: TEditorGroup = [
    {
      tooltip: "引用",
      Icon: <MessageSquareQuote size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      active: {
        name: "blockquote",
      },
    },
    {
      tooltip: "分割线",
      Icon: <MinusIcon size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      tooltip: "上传文件",
      Icon: <Image />,
      onClick: () => {
        const inputNode = document.createElement("input");
        inputNode.setAttribute("type", "file");
        inputNode.addEventListener("change", (event) => {
          if (event.target) {
            const files = (event.target as HTMLInputElement).files;
            if (files) {
              if (files[0].type.startsWith("image/")) {
                const file = files[0];
                const formData = new FormData();
                formData.append("file", file);

                uploadImage(formData).then((res) => {
                  editor
                    .chain()
                    .focus()
                    .setImage({
                      src: apiConfig.baseUrl + res.data.data.path,
                    })
                    .run();
                });
              } else {
                toast.error("只能上传图片文件");
              }
            }
          }
        });
        inputNode.click();
      },
    },
  ];

  const editorItemsGroup4: TEditorGroup = [
    {
      tooltip: "强制换行",
      Icon: <WrapTextIcon size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      tooltip: "清除样式",
      Icon: <RemoveFormatting size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
  ];

  const editorItemsGroup5: TEditorGroup = [
    {
      tooltip: "撤销",
      Icon: <Undo2Icon size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().chain().focus().undo().run(),
    },
    {
      tooltip: "恢复",
      Icon: <Redo2Icon size={15} strokeWidth={3} />,
      onClick: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().chain().focus().redo().run(),
    },
  ];

  return [
    editorItemsGroup1,
    editorItemsGroup2,
    editorItemsGroup3,
    editorItemsGroup4,
    editorItemsGroup5,
  ];
};

export default getMenuItemGroups;
