import IeseEditor, { useAritcleEditor } from "@/components/editor";
import FloatMenu from "@/components/editor/FloatMenu";
import MenuBar from "@/components/editor/MenuBar";
import { toastMessage } from "@/components/toast";
import { updateArticle } from "@/service/article";
import { IUpdateArticleRequest } from "@/types/article";
import {
  Badge,
  Button,
  Card,
  Container,
  Input,
  Select,
  Tooltip,
} from "@mantine/core";
import { EditorContent } from "@tiptap/react";
import clsx from "clsx";
import { Undo2 } from "lucide-react";
import { FC, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  showEdit = false,
  title,
  type,
}) => {
  const editor = useAritcleEditor(content, editable);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editorRef = useRef(null);

  const articleId = searchParams.get("id") as string;
  const [form, setForm] = useState<IUpdateArticleRequest>({
    title: title || "",
    type: title || "",
    content: "",
    articleId,
  });

  const handleUpdate = async () => {
    try {
      const data: IUpdateArticleRequest = {
        ...form,
        content: editor.getHTML(),
      };
      await updateArticle(data);
      toastMessage.success("短文更新成功");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Card
      className={clsx(
        className,
        "rounded-lg border-0 shadow-none flex flex-col gap-4"
      )}
    >
      <div className="flex-auto flex flex-col gap-4">
        {showEdit && (
          <>
            <div className="flex flex-row flex-nowrap justify-between items-center">
              <Tooltip label="返回">
                <Undo2
                  className="text-gray-600 dark:"
                  onClick={() => {
                    navigate("/home/profile");
                  }}
                />
              </Tooltip>
              <div className="flex gap-2">
                <Button color="red" variant="light">
                  取消
                </Button>
                <Button onClick={handleUpdate}>保存</Button>
              </div>
            </div>
            <div className="flex  gap-4 nowrap ">
              <div className="flex-1">
                <Badge className="text-[1rem] bg-theme_blue">标题</Badge>
                <Input
                  className="text-center mt-1 min-w-[200px] "
                  placeholder="Title"
                  defaultValue={title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                ></Input>
              </div>
              <Select
                label="类型"
                placeholder="Pick value"
                defaultValue={type}
                onChange={(e) => setForm({ ...form, type: e })}
                data={["日常", "分享", "感悟", "学习"]}
              />
            </div>
          </>
        )}

        <Badge className="text-[1rem] bg-theme_blue p-2">文章</Badge>
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
