import { useAritcleEditor } from "@/components/editor";
import { Card } from "@mantine/core";
import { EditorContent } from "@tiptap/react";
import clsx from "clsx";
import { FC } from "react";

interface IProps {
  content: string;
  className?: string;
}

const ArticlePreview: FC<IProps> = ({ content, className }) => {
  const editor = useAritcleEditor(content, false);
  return (
    <Card className={clsx(className, "rounded-lg  p-0  dark:")}>
      <EditorContent editor={editor} />
    </Card>
  );
};

export default ArticlePreview;
