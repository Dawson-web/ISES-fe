import { useEffect, useState, useRef } from 'react';
import { Input, Button, Space, Message, Avatar, Tag, Dropdown, Menu, Upload, Select } from '@arco-design/web-react';
import { 
  IconImage, 
  IconBold, 
  IconItalic,
  IconUnderline,
  IconStrikethrough,
  IconOrderedList,
  IconUnorderedList,
  IconQuote,
  IconCode,
  IconLink,
  IconFaceSmileFill,
  IconSave,
  IconSend,
  IconMore,
  IconDelete
} from '@arco-design/web-react/icon';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import './style.css';
import { createArticle } from '@/service/article';
import { IArticleForm } from '@/types/article';

const CATEGORY = [
  {
    label: '日常',
    value: 'life'
  },
  {
    label: '校园',
    value: 'campus'
  },
  {
    label: '公司爆料',
    value: 'company'
  }
]

const CONTENT_TYPE = {
  'life': ['动态','技术','分享'],
  'campus': ['内推'],
  'company': ['信息']
}



const formatTools = [
  { icon: <IconBold />, tip: '加粗', type: 'bold' },
  { icon: <IconItalic />, tip: '斜体', type: 'italic' },
  { icon: <IconUnderline />, tip: '下划线', type: 'underline' },
  { icon: <IconStrikethrough />, tip: '删除线', type: 'strike' },
  { icon: <IconOrderedList />, tip: '有序列表', type: 'orderedList' },
  { icon: <IconUnorderedList />, tip: '无序列表', type: 'unorderedList' },
  { icon: <IconQuote />, tip: '引用', type: 'quote' },
  { icon: <IconCode />, tip: '代码', type: 'code' },
  { icon: <IconLink />, tip: '链接', type: 'link' }
];

export default function ArticleEditPage() {
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get('id');
  const [form, setForm] = useState<IArticleForm>({
    title: '',
    content: '',
    type: '技术',
    cover: '',
    category: undefined,
    contentType: undefined,
    tags: [],
    excerpt: ''
  });
  const [isDraft, setIsDraft] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef<any>(null);

  const { isSuccess, data } = useQuery({
    queryKey: [articleId],
    // queryFn: () => getArticleDetail(articleId as string),
    enabled: !!articleId
  });

  useEffect(() => {
    if (isSuccess && data?.data?.data) {
      const { title, content, type, cover, category, contentType, tags, excerpt } = data.data.data;
      setForm({
        title,
        content,
        type,
        cover,
        category,
        contentType,
        tags,
        excerpt
      });
      setWordCount(content.length);
    }
  }, [isSuccess, data]);

  const handleEditorChange = (value: string) => {
    setForm(prev => ({
      ...prev,
      content: value
    }));
    setWordCount(value.length);
  };

  const handleSave = async (isDraft = true) => {
    if (!form.title.trim()) {
      Message.error('请输入文章标题');
      return;
    }
    if (!form.content.trim()) {
      Message.error('请输入文章内容');
      return;
    }
    if (!form.category) {
      Message.error('请选择文章分类');
      return;
    }
    if (!form.contentType) {
      Message.error('请选择内容类型');
      return;
    }
   await createArticle(form).then((res) => {
    if (res.data.status) {
      Message.success('发布成功');
    } else {
      Message.error('发布失败');
    }
   })
    // TODO: 实现保存逻辑
  };

  const handleFormat = (type: string) => {
    if (!editorRef.current) return;

    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;
    const content = form.content;
    const selectedText = content.substring(start, end);

    const formatMap: Record<string, (text: string) => string> = {
      bold: text => `**${text}**`,
      italic: text => `*${text}*`,
      underline: text => `<u>${text}</u>`,
      strike: text => `~~${text}~~`,
      orderedList: text => `1. ${text}`,
      unorderedList: text => `- ${text}`,
      quote: text => `> ${text}`,
      code: text => `\`${text}\``,
      link: text => `[${text}](链接地址)`
    };

    if (formatMap[type]) {
      const newText = formatMap[type](selectedText || '文本');
      const newContent = content.substring(0, start) + newText + content.substring(end);
      setForm(prev => ({ ...prev, content: newContent }));
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      // TODO: 实现图片上传到服务器的逻辑
      const fakeUrl = URL.createObjectURL(file);
      const imageMarkdown = `![${file.name}](${fakeUrl})`;
      
      if (editorRef.current) {
        const start = editorRef.current.selectionStart;
        const content = form.content;
        const newContent = content.substring(0, start) + imageMarkdown + content.substring(start);
        setForm(prev => ({ ...prev, content: newContent }));
      }
      
      Message.success('图片插入成功');
      return false;
    } catch (error) {
      Message.error('图片上传失败');
      return false;
    }
  };

  const moreMenu = (
    <Menu>
      <Menu.Item key="template">
        <IconFaceSmileFill className="mr-2" />
        插入表情
      </Menu.Item>
      <Menu.Item key="delete">
        <IconDelete className="mr-2" />
        删除文章
      </Menu.Item>
    </Menu>
  );
  
  return (
    <div className="editor-container">
      <header className="editor-header">
        <div className="header-content">
          <div className="header-left">
            <Avatar size={32}>D</Avatar>
            <Input
              placeholder="输入文章标题..."
              value={form.title}
              onChange={value => setForm(prev => ({ ...prev, title: value }))}
              className="title-input"
            />
            <Tag color={isDraft ? 'gray' : 'arcoblue'} className="status-tag">
              {isDraft ? '草稿' : '已发布'}
            </Tag>
          </div>
          <div className="header-right">
            <Button 
              type="secondary"
              icon={<IconSave />}
              onClick={() => handleSave(true)}
            >
              保存草稿
            </Button>
            <Button 
              type="primary"
              icon={<IconSend />}
              onClick={() => handleSave(false)}
            >
              发布文章
            </Button>
            <Dropdown droplist={moreMenu} position="br">
              <Button 
                type="text"
                icon={<IconMore />}
                className="more-btn"
              />
            </Dropdown>
          </div>
        </div>
      </header>

      <main className="editor-main">
      
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
                  onChange={value => setForm(prev => ({ ...prev, category: value }))}
                >
                  {CATEGORY.map(({value, label}) => (
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
                  onChange={value => setForm(prev => ({ ...prev, contentType: value }))}
                >
                  {form.category && CONTENT_TYPE[form.category as keyof typeof CONTENT_TYPE].map((value) => (
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
                onChange={value => setForm(prev => ({ ...prev, tags: value }))}
              />
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">引言</div>
              <Input.TextArea
                placeholder="请输入文章引言，将显示在文章列表中"
                className="w-full"
                style={{ minHeight: '100px' }}
                value={form.excerpt}
                onChange={value => setForm(prev => ({ ...prev, excerpt: value }))}
                maxLength={200}
                showWordLimit
              />
            </div>
          </div>
        </div>
      <div>
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
        </div>
      </main>
    </div>
  );
}
