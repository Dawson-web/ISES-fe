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
    <Card
      className={clsx(
        className,
        "rounded-lg  dark:bg-theme_dark border border-gray-300 dark:border-gray-600 dark:text-white"
      )}
    >
      <EditorContent editor={editor} />
    </Card>
  );
};

export default ArticlePreview;
