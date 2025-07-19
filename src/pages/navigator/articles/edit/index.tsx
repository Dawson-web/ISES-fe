import { useState } from "react";
import {
  Input,
  Button,
  Message,
  Avatar,
  Tag,
  Select,
} from "@arco-design/web-react";
import { IconSave, IconSend } from "@arco-design/web-react/icon";
// import { useSearchParams } from 'react-router-dom';

import "./style.css";
// import { createArticle } from '@/service/article';
import { IArticleForm } from "@/types/article";
import { createArticleApi } from "@/service/article";
import IeseEditor, { useAritcleEditor } from "@/components/editor";
import MenuBar from "@/components/editor/MenuBar";
import { useDraft } from "@/hooks/useDraft";

const CATEGORY = [
  {
    label: "日常",
    value: "life",
  },
  {
    label: "校园",
    value: "campus",
  },
  {
    label: "公司爆料",
    value: "company",
  },
];

export const CONTENT_TYPE = {
  life: ["动态", "技术", "分享"],
  campus: ["内推"],
  company: ["信息"],
};

export default function ArticleEditPage() {
  const [form, setForm] = useState<IArticleForm>({
    title: "",
    content: "",
    type: "技术",
    cover: "",
    category: undefined,
    contentType: undefined,
    tags: [],
    excerpt: "",
  });

  const [isDraft] = useState(true);
  const editor = useAritcleEditor("");
  const { hasDraft, importDraft, deleteDraft } = useDraft({
    getEditorContent: () => editor?.getJSON(),
    setEditorContent: (content) => editor?.commands.setContent(content),
    //getOtherFields: () => ({
    // title: form.title,
    //tags: form.tags,
    //category: form.category,
    //contentType: form.contentType,
    //excerpt: form.excerpt,
    //}),
    //setOtherFields: (fields) => {
    //  setForm((prev) => ({
    //    ...prev,
    //    title: fields.title || prev.title,
    //    tags: fields.tags || prev.tags,
    //   category: fields.category || prev.category,
    //  contentType: fields.contentType || prev.contentType,
    //  excerpt: fields.excerpt || prev.excerpt,
    //  }));
    //},
  });

  const handleSave = async () => {
    if (!form.title.trim()) {
      Message.error("请输入文章标题");
      return;
    }
    if (!editor.getHTML().trim()) {
      Message.error("请输入文章内容");
      return;
    }
    if (!form.category) {
      Message.error("请选择文章分类");
      return;
    }
    if (!form.contentType) {
      Message.error("请选择内容类型");
      return;
    }
    await createArticleApi({ ...form, content: editor.getHTML() }).then(
      (res) => {
        if (res.data.status) {
          Message.success("发布成功");
        } else {
          Message.error("发布失败");
        }
      }
    );
    // TODO: 实现保存逻辑
  };

  return (
    <div className="editor-container p-6 ">
      <header className="editor-header">
        <div className="header-content flex justify-between flex-wrap gap-4">
          <div className="header-left">
            <Avatar size={32}>D</Avatar>
            <Input
              placeholder="输入文章标题..."
              value={form.title}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, title: value }))
              }
              className="title-input"
            />
            <Tag color={isDraft ? "gray" : "arcoblue"} className="status-tag">
              {isDraft ? "草稿" : "已发布"}
            </Tag>
          </div>
          <div className="header-right">
            {hasDraft && (
              <Button
                type="secondary"
                icon={<IconSave />}
                onClick={importDraft}
              >
                导入草稿
              </Button>
            )}
            <Button
              type="secondary"
              icon={<IconSave />}
              // onClick={() => handleSave(true)}
            >
              保存草稿
            </Button>
            <Button
              type="primary"
              icon={<IconSend />}
              onClick={() => handleSave()}
            >
              发布文章
            </Button>
          </div>
        </div>
      </header>

      <main className="editor-main bg-white">
        <div>
          <div className="mb-6">
            <div className="text-base font-medium text-gray-800 mb-4 pl-3 border-l-4 border-[#165DFF]">
              文章信息
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-2">分类</div>
                <Select
                  placeholder="请选择文章分类"
                  className="w-full"
                  allowClear
                  value={form.category}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, category: value }))
                  }
                >
                  {CATEGORY.map(({ value, label }) => (
                    <Select.Option key={value} value={value}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-2">内容类型</div>
                <Select
                  placeholder="请选择内容类型"
                  className="w-full"
                  allowClear
                  value={form.contentType}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, contentType: value }))
                  }
                >
                  {form.category &&
                    CONTENT_TYPE[
                      form.category as keyof typeof CONTENT_TYPE
                    ].map((value) => (
                      <Select.Option key={value} value={value}>
                        {value}
                      </Select.Option>
                    ))}
                </Select>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">标签</div>
              <Select
                mode="multiple"
                placeholder="请输入标签，按回车确认"
                className="w-full"
                allowCreate
                allowClear
                value={form.tags}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, tags: value }))
                }
              />
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">引言</div>
              <Input.TextArea
                placeholder="请输入文章引言，将显示在文章列表中"
                className="w-full"
                style={{ minHeight: "100px" }}
                value={form.excerpt}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, excerpt: value }))
                }
                maxLength={200}
                showWordLimit
              />
            </div>
          </div>
        </div>
        <MenuBar editor={editor} />
        <IeseEditor editor={editor} className="w-full h-full" />
        {/* <div>
        <div className="editor-toolbar">
          <Space size="small" className="format-tools">
            {formatTools.map((tool, index) => (
              <Button
                key={index}
                type="text"
                className="tool-btn"
                icon={tool.icon}
                title={tool.tip}
                onClick={() => handleFormat(tool.type)}
              />
            ))}
          </Space>
          <div className="divider" />
          <Space size="small" className="insert-tools">
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={handleImageUpload}
            >
              <Button
                type="text"
                className="tool-btn"
                icon={<IconImage />}
                title="插入图片"
              />
            </Upload>
          </Space>
        </div>
        <div className="editor-content">
          <Input.TextArea
            ref={editorRef}
            placeholder="开始创作精彩内容..."
            value={form.content}
            onChange={handleEditorChange}
            className="content-input"
          />
          <div className="word-count">
            {wordCount} 字
          </div>
        </div>
        </div> */}
      </main>
    </div>
  );
}
