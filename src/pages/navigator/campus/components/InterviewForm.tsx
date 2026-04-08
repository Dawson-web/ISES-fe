import { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Tag,
  Divider,
  Typography,
} from '@arco-design/web-react';
import { IconPlus, IconDelete } from '@arco-design/web-react/icon';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  IInterviewQuestion,
  IInterviewPost,
  IInterviewPostRequest,
  ROUND_LABELS,
  DIFFICULTY_LABELS,
  CATEGORY_LABELS,
} from '@/types/interview';
import { createInterviewPostApi, updateInterviewPostApi } from '@/service/interview';

const { TextArea } = Input;
const { Text } = Typography;
const FormItem = Form.Item;

interface InterviewFormProps {
  visible: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  postId?: string;
  initialValues?: IInterviewPost | null;
  afterSuccess?: () => void;
}

const ROUND_OPTIONS = Object.entries(ROUND_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const DIFFICULTY_OPTIONS = Object.entries(DIFFICULTY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

// 空题目模板
const createEmptyQuestion = (): IInterviewQuestion => ({
  question: '',
  answer: '',
  type: '',
});

const InterviewForm = ({
  visible,
  onClose,
  mode = 'create',
  postId,
  initialValues,
  afterSuccess,
}: InterviewFormProps) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [questions, setQuestions] = useState<IInterviewQuestion[]>([createEmptyQuestion()]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // 添加题目
  const handleAddQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  }, []);

  // 删除题目
  const handleRemoveQuestion = useCallback((index: number) => {
    setQuestions((prev) => {
      if (prev.length <= 1) {
        toast.error('至少需要一道面试题');
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // 更新题目
  const handleUpdateQuestion = useCallback(
    (index: number, field: keyof IInterviewQuestion, value: string) => {
      setQuestions((prev) =>
        prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
      );
    },
    [],
  );

  // 添加标签
  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      toast.error('标签已存在');
      return;
    }
    if (tags.length >= 10) {
      toast.error('最多添加 10 个标签');
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setTagInput('');
  }, [tagInput, tags]);

  // 删除标签
  const handleRemoveTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleReset = useCallback(() => {
    form.resetFields();
    setQuestions([createEmptyQuestion()]);
    setTags([]);
    setTagInput('');
  }, [form]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (mode === 'edit' && initialValues) {
      form.setFieldsValue({
        title: initialValues.title,
        companyName: initialValues.companyName,
        position: initialValues.position,
        round: initialValues.round,
        difficulty: initialValues.difficulty,
        category: initialValues.category,
        summary: initialValues.content?.summary || '',
        tips: initialValues.content?.tips || '',
      });
      setQuestions(
        initialValues.content?.questions?.length
          ? initialValues.content.questions.map((item) => ({
            question: item.question || '',
            answer: item.answer || '',
            type: item.type || '',
          }))
          : [createEmptyQuestion()]
      );
      setTags(Array.isArray(initialValues.tags) ? initialValues.tags : []);
      setTagInput('');
      return;
    }

    handleReset();
  }, [visible, mode, initialValues, form, handleReset]);

  // 提交
  const { mutateAsync: submitPost, isPending } = useMutation({
    mutationFn: (data: IInterviewPostRequest) =>
      mode === 'edit' && postId
        ? updateInterviewPostApi(postId, data)
        : createInterviewPostApi(data),
    onSuccess: () => {
      toast.success(mode === 'edit' ? '面经更新成功！' : '面经发布成功！');
      queryClient.invalidateQueries({ queryKey: ['interviewList'] });
      queryClient.invalidateQueries({ queryKey: ['interviewStats'] });
      queryClient.invalidateQueries({ queryKey: ['hotInterviews'] });
      if (postId) {
        queryClient.invalidateQueries({ queryKey: ['interviewDetail', postId] });
      }
      if (mode === 'create') {
        handleReset();
      }
      afterSuccess?.();
      onClose();
    },
    onError: () => {
      toast.error(mode === 'edit' ? '更新失败，请重试' : '发布失败，请重试');
    },
  });

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validate();

      // 校验题目
      const validQuestions = questions.filter((q) => q.question.trim());
      if (validQuestions.length === 0) {
        toast.error('至少需要填写一道面试题目');
        return;
      }

      const postData: IInterviewPostRequest = {
        title: values.title,
        companyName: values.companyName,
        position: values.position,
        round: values.round,
        difficulty: values.difficulty,
        category: values.category,
        content: {
          questions: validQuestions,
          summary: values.summary || undefined,
          tips: values.tips || undefined,
        },
        tags: tags.length > 0 ? tags : undefined,
      };

      await submitPost(postData);
    } catch {
      // 表单验证失败，Arco Form 会自动显示错误
    }
  }, [form, questions, tags, submitPost]);
  return (
    <Modal
      title={mode === 'edit' ? '编辑面经' : '分享面经'}
      visible={visible}
      onCancel={onClose}
      autoFocus={false}
      focusLock
      style={{ width: 720, maxWidth: '95vw' }}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" loading={isPending} onClick={handleSubmit}>
            {mode === 'edit' ? '保存修改' : '发布面经'}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        scrollToFirstError
      >
        {/* 基本信息 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <FormItem
            label="面经标题"
            field="title"
            rules={[{ required: true, message: '请输入面经标题' }]}
            className="col-span-full"
          >
            <Input placeholder="如：字节跳动前端一面经验分享" maxLength={100} showWordLimit />
          </FormItem>

          <FormItem
            label="公司名称"
            field="companyName"
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="如：字节跳动" maxLength={50} />
          </FormItem>

          <FormItem
            label="面试岗位"
            field="position"
            rules={[{ required: true, message: '请输入面试岗位' }]}
          >
            <Input placeholder="如：前端开发工程师" maxLength={50} />
          </FormItem>

          <FormItem
            label="面试轮次"
            field="round"
            rules={[{ required: true, message: '请选择面试轮次' }]}
          >
            <Select placeholder="选择轮次" options={ROUND_OPTIONS} />
          </FormItem>

          <FormItem
            label="难度评价"
            field="difficulty"
            rules={[{ required: true, message: '请选择难度' }]}
          >
            <Select placeholder="选择难度" options={DIFFICULTY_OPTIONS} />
          </FormItem>

          <FormItem
            label="面试类型"
            field="category"
            rules={[{ required: true, message: '请选择面试类型' }]}
            className="col-span-full sm:col-span-1"
          >
            <Select placeholder="选择类型" options={CATEGORY_OPTIONS} />
          </FormItem>
        </div>

        <Divider className="!my-4" />

        {/* 面试题目 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <Text className="text-[14px] font-medium text-gray-800">
              面试题目 <span className="text-red-500">*</span>
            </Text>
            <Button
              type="text"
              size="small"
              icon={<IconPlus />}
              onClick={handleAddQuestion}
            >
              添加题目
            </Button>
          </div>

          <div className="space-y-3">
            {questions.map((q, index) => (
              <div
                key={index}
                className="relative rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center mt-1">
                    {index + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="面试题目"
                      value={q.question}
                      onChange={(val) => handleUpdateQuestion(index, 'question', val)}
                    />
                    <TextArea
                      placeholder="参考答案（选填）"
                      value={q.answer}
                      onChange={(val) => handleUpdateQuestion(index, 'answer', val)}
                      autoSize={{ minRows: 2, maxRows: 5 }}
                    />
                  </div>
                  <Button
                    type="text"
                    status="danger"
                    size="small"
                    icon={<IconDelete />}
                    onClick={() => handleRemoveQuestion(index)}
                    className="flex-shrink-0 mt-1"
                    aria-label={`删除第 ${index + 1} 题`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider className="!my-4" />

        {/* 补充信息 */}
        <FormItem label="面经总结" field="summary">
          <TextArea
            placeholder="分享你对这次面试的整体感受和总结..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            maxLength={500}
            showWordLimit
          />
        </FormItem>

        <FormItem label="面试Tips" field="tips">
          <TextArea
            placeholder="给后来者的建议，如如何准备、需要注意什么..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            maxLength={500}
            showWordLimit
          />
        </FormItem>

        {/* 标签 */}
        <FormItem label="标签（选填）">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="输入标签后按回车添加"
                value={tagInput}
                onChange={(val) => setTagInput(val)}
                onPressEnter={handleAddTag}
                style={{ width: 200 }}
              />
              <Button size="small" onClick={handleAddTag}>
                添加
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => handleRemoveTag(tag)}
                    color="arcoblue"
                    size="small"
                  >
                    #{tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default InterviewForm;
