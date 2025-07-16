import { Modal, Form, Input, Upload, DatePicker, Radio, Message, Select, Rate } from '@arco-design/web-react';
import { IconUpload } from '@arco-design/web-react/icon';
import type { UploadItem } from '@arco-design/web-react/es/Upload';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '@/store/User';
import { registerCompanyApi } from '@/service/company';
import { toast } from 'sonner';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

interface CompanyFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: CompanyFormData) => void;
}

interface CompanyFormData {
  name: string;
  address: string[];
  logo?: string;
  description?: string;
  establishedDate?: Date;
  mainBusiness: string[];
  employeeCount?: string;
  scaleRating?: number;
  isVerified?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  metadata?: {
    internalCode?: string;
    website?: string;
  };
}

const EMPLOYEE_COUNT_OPTIONS = [
  { label: '1-99人', value: '1-99' },
  { label: '100-1000人', value: '100-1000' },
  { label: '1000-9999人', value: '1000-9999' },
  { label: '9999人以上', value: '9999+' }
];

const CompanyFormModal = observer(({ visible, onClose, onSubmit }: CompanyFormModalProps) => {
  const [form] = Form.useForm<CompanyFormData>();
  const [fileList, setFileList] = useState<UploadItem[]>([]);
  const isAdmin = userStore.role === 1;
  
  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      // 如果有上传logo，使用第一个文件的URL
      if (fileList.length > 0 && fileList[0].url) {
        values.logo = fileList[0].url;
      }
      // 处理metadata
      values.metadata = {
        internalCode: values.metadata?.internalCode,
        website: values.metadata?.website
      };
      await registerCompanyApi({
        ...values,
        status: 'pending' // 新提交的公司信息默认为pending状态
      }).then(() => {
        toast.success('提交成功');
      }).catch(()=>{
        toast.error('提交失败')
      }).finally(() => {
        form.resetFields();
        setFileList([]);
        onClose();
      })
    } catch (error) {
      toast.error('表单验证失败，请检查必填项');
    }
  };

  return (
    <Modal
      title="添加公司信息"
      visible={visible}
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        setFileList([]);
        onClose();
      }}
      autoFocus={false}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0 10px' }}
      >
        <FormItem
          label="公司名称"
          field="name"
          rules={[{ required: true, message: '请输入公司名称' }]}
        >
          <Input placeholder="请输入公司名称" />
        </FormItem>

        <FormItem label="公司logo" field="logo">
          <Upload
            listType="picture-card"
            limit={1}
            fileList={fileList}
            onChange={(fileList) => setFileList(fileList)}
          >
            <div className="arco-upload-trigger-picture">
              <div className="arco-upload-trigger-picture-text">
                <IconUpload />
                <div style={{ marginTop: 10 }}>上传Logo</div>
              </div>
            </div>
          </Upload>
        </FormItem>

        <FormItem 
          label="公司地址" 
          field="address"
          rules={[{ required: true, message: '请输入公司地址' }]}
        >
          <Select
            mode="multiple"
            allowCreate
            placeholder="请输入公司地址，可多选"
            allowClear
          />
        </FormItem>

        <FormItem label="成立时间" field="establishedDate">
          <DatePicker style={{ width: '100%' }} />
        </FormItem>

        <FormItem 
          label="主营业务" 
          field="mainBusiness"
          rules={[{ required: true, message: '请输入主营业务' }]}
        >
          <Select
            mode="multiple"
            allowCreate
            placeholder="请输入主营业务，可多选"
            allowClear
          />
        </FormItem>

        <FormItem 
          label="员工人数" 
          field="employeeCount"
          rules={[{ required: true, message: '请选择员工人数' }]}
        >
          <Select
            placeholder="请选择员工人数"
            options={EMPLOYEE_COUNT_OPTIONS}
          />
        </FormItem>

        {isAdmin && (
          <>
            <FormItem label="公司规模评级" field="scaleRating">
              <Rate count={5} />
            </FormItem>

            <FormItem label="认证状态" field="isVerified" initialValue={false}>
              <Radio.Group>
                <Radio value={true}>已认证</Radio>
                <Radio value={false}>未认证</Radio>
              </Radio.Group>
            </FormItem>
          </>
        )}

        <FormItem label="公司简介" field="description">
          <TextArea
            placeholder="请输入公司简介"
            maxLength={500}
            showWordLimit
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </FormItem>

        <FormItem label="内推码" field="metadata.internalCode">
          <Input placeholder="请输入内推码" />
        </FormItem>

        <FormItem 
          label="官网链接" 
          field="metadata.website"
          rules={[
            {
              type: 'url',
              message: '请输入有效的URL'
            }
          ]}
        >
          <Input placeholder="请输入官网链接" />
        </FormItem>
      </Form>
    </Modal>
  );
});

export default CompanyFormModal;