import { Badge, Button, Card } from "@mantine/core";
import MarkDownLogo from "./MarkDownLogo";
import { FC, PropsWithChildren, useEffect, useRef } from "react";
import { IArticleFiled } from "@/types/article";
import { addArticle } from "@/service/article";
import { Editor } from "@tiptap/react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { addArticleToDB } from "@/utils/articleIndexDB";
import { toastMessage } from "@/components/toast";
import { toast } from "sonner";

const TipHeader: FC<PropsWithChildren> = ({ children }) => {
  return <div className="text-primary my-2 text-sm">{children}</div>;
};

const TipContent: FC<PropsWithChildren> = ({ children }) => {
  return <div className="text-gray-200 text-sm">{children}</div>;
};

const TipContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className="my-8">{children}</div>;
};

interface SideTipProps {
  article: IArticleFiled;
  editor: Editor;
  className?: string;
}

const SideTip: FC<SideTipProps> = ({ article, editor, className }) => {
  const navigate = useNavigate();

  const isPosted = useRef(false);
  const count = useRef(0);

  function vertify() {
    article.content = editor.getHTML();
    if (!article.title) {
      toastMessage.error("请填写文章标题");
      return false;
    }
    if (editor.getHTML() === "") {
      toastMessage.error("请填写文章内容");
      return false;
    }
    if (!article.type) {
      toastMessage.error("请填写文章类型");
      return false;
    }
    return true;
  }

  const handlePublish = async () => {
    if (vertify()) {
      try {
        const res = await addArticle({ ...article, content: editor.getHTML() });
        isPosted.current = true;
        navigate(`/home/article?id=${res.data.data.id}`);
        toastMessage.success("发布成功");
      } catch (error) {
        toastMessage.error(String(error));
      }
    }
  };
  const articleRef = useRef(article);
  articleRef.current = article; // 每次渲染后更新为最新值

  useEffect(() => {
    return () => {
      if (!isPosted.current && count.current > 0) {
        toast("是否将草稿保留到本地", {
          action: {
            label: "确认",
            onClick: () =>
              addArticleToDB({
                ...articleRef.current,
                content: editor.getHTML(),
              }),
          },
        });
      }
      count.current++; // 标记已弹窗
    };
  }, []);

  return (
    <Card className={clsx("rounded-lg  shadow-lg ", className)} key="sideTip">
      <Button
        variant="gradient"
        gradient={{ from: "blue", to: "cyan", deg: 90 }}
        onClick={handlePublish}
      >
        发布
      </Button>
      <Card.Section className="p-4">
        <Badge className="bg-theme_blue">提示</Badge>
        <div className="dark:">
          <TipContainer>
            <TipHeader>书写流程</TipHeader>
            <TipContent>
              <li>填写文章基本信息</li>
              <li>在编辑器中填写文章内容主体</li>
              <li>点击发布</li>
            </TipContent>
          </TipContainer>
          <TipContainer>
            <TipHeader>
              <div className="flex justify-between items-center ">
                Markdown 支持 <MarkDownLogo />
              </div>
            </TipHeader>
            <TipContent>
              <>
                本编辑器支持
                <a
                  target="_blank"
                  className="text-default-400 mx-2"
                  href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
                >
                  markdown 语法
                </a>
                以及快捷键，也可通过上方工具栏调整样式。
              </>
            </TipContent>
          </TipContainer>
        </div>
      </Card.Section>
    </Card>
  );
};

export default SideTip;
