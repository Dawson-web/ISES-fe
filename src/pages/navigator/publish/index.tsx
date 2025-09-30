import { useState } from "react";
import {
  Input,
  Button,
  Message,
  Avatar,
  Tag,
  Select,
  Modal,
  List,
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
import { set } from "mobx";

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
  const [draftModalVisible, setDraftModalVisible] = useState(false);
  const [tag, setTag] = useState(1);
  const [drafts, setDrafts] = useState<
    Array<{
      id: number;
      content: any;
      title: string;
      category: string;
      excerpt: string;
      contentType: string;
      tags: string[];
    }>
  >([]);
  console.log(tag)
  //调用钩子
  const { importDraft, deleteDraft, fetchAllDrafts, toSaveDraft, lastId } =
    useDraft({
      getEditorContent: () => editor?.getJSON(),
      setEditorContent: (content) => editor?.commands.setContent(content),
      getOtherFields: () => ({
        title: form.title,
        tags: form.tags,
        category: form.category,
        contentType: form.contentType,
        excerpt: form.excerpt,
      }),
      setOtherFields: (fields: any) => {
        setForm((prev) => ({
          ...prev,
          title: fields.title || prev.title,
          tags: fields.tags || prev.tags,
          category: fields.category || prev.category,
          contentType: fields.contentType || prev.contentType,
          excerpt: fields.excerpt || prev.excerpt,
        }));
      },
    });
  //模块框功能

  const handleOpenDraftModal = async () => {
    setDraftModalVisible(true);
    const draft  = await fetchAllDrafts();
    setDrafts(draft.reverse() as any);
  };

  const handleImportDraft = (id: number) => {
    importDraft(id);
    setDraftModalVisible(false);
  };

  const handleDeleteDraft = (id: number) => {
    Modal.confirm({
      title: "确认删除？",
      content: "删除后将无法恢复",
      onOk: () => {
        //await deleteDraft(id);
        //setDrafts(drafts.filter((draft) => draft.id !== id));
        //setDraftModalVisible(false);
        try {
          deleteDraft(id);
          setDrafts(drafts.filter((draft) => draft.id !== id)); // 更新列表
        } catch (e) {
          console.error("删除失败", e);
          Message.error("删除失败，请重试");
          throw e;
        }
      },
    });
    setDraftModalVisible(false);
  };

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
          setForm({
            title: "",
            content: "",
            type: "技术",
            cover: "",
            category: undefined,
            contentType: undefined,
            tags: [],
            excerpt: "",
          })
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
            <Button
              type="secondary"
              icon={<IconSave />}
              onClick={handleOpenDraftModal}
            >
              导入草稿
            </Button>
            <Button
              type="secondary"
              icon={<IconSave />}
              onClick={() => {
                toSaveDraft();
                setTag(0);
              }}
            >
              保存草稿
            </Button>
            <Button
              type="primary"
              icon={<IconSend />}
              onClick={() => {
                handleSave();
                if (lastId.current) {
                  deleteDraft(lastId.current);
                  setDrafts(
                    drafts.filter((draft) => draft.id !== lastId.current)
                  );
                  lastId.current = null;
                }
              }}
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
      </main>

      <Modal
        title="导入草稿"
        visible={draftModalVisible}
        onCancel={() => setDraftModalVisible(false)}
        footer={null}
        style={{ width: 600 }}
      >
        {drafts.length === 0 ? (
          <div className="text-center py-10 text-gray-400">暂无草稿</div>
        ) : (
          <List
            bordered={false}
            dataSource={drafts}
            render={(draft) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    onClick={() => handleImportDraft(draft.id)}
                  >
                    导入
                  </Button>,
                  <Button
                    type="text"
                    status="danger"
                    onClick={() => handleDeleteDraft(draft.id)}
                  >
                    删除
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <div className="flex items-center">
                      <span className="font-medium mr-2">
                        {draft.title || "无标题草稿"}
                      </span>
                    </div>
                  }
                  description={
                    <div>
                      <div className="text-xs text-gray-500">
                        {
                          //new Date(draft.id).toLocaleString()
                          new Date(draft.id).toLocaleString("zh-CN", {
                            timeZone: "Asia/Shanghai",
                          })
                        }
                      </div>
                      {draft.excerpt && (
                        <div className="mt-1 text-gray-600 line-clamp-1">
                          {draft.excerpt}
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
}
