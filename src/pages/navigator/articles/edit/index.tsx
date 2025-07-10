import { useEffect, useState, useRef } from 'react';
import { Input, Button, Space, Message, Avatar, Tag, Dropdown, Menu, Upload } from '@arco-design/web-react';
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
import { getArticleDetail } from '@/service/article';
import './style.css';

interface IArticleForm {
  title: string;
  content: string;
  type: string;
  cover?: string;
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
    cover: ''
  });
  const [isDraft, setIsDraft] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef<any>(null);

  const { isSuccess, data } = useQuery({
    queryKey: [articleId],
    queryFn: () => getArticleDetail(articleId as string),
    enabled: !!articleId
  });

  useEffect(() => {
    if (isSuccess && data?.data?.data) {
      const { title, content, type, cover } = data.data.data;
      setForm({
        title,
        content,
        type,
        cover
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
    // TODO: 实现保存逻辑
    Message.success(isDraft ? '已保存草稿' : '发布成功');
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
      </main>
    </div>
  );
}
