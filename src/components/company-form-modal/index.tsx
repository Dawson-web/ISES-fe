import { Modal, Form, Input, InputNumber, Upload, DatePicker, Radio, Message } from '@arco-design/web-react';
import { IconUpload } from '@arco-design/web-react/icon';
import type { UploadItem } from '@arco-design/web-react/es/Upload';
import { useState } from 'react';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

interface CompanyFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: CompanyFormData) => void;
}

interface CompanyFormData {
  name: string;
  address?: string;
  logo?: string;
  description?: string;
  establishedDate?: Date;
  mainBusiness?: string;
  employeeCount?: number;
  scaleRating?: number;
  isVerified?: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

const CompanyFormModal = ({ visible, onClose, onSubmit }: CompanyFormModalProps) => {
  const [form] = Form.useForm<CompanyFormData>();
  const [fileList, setFileList] = useState<UploadItem[]>([]);
  
  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      // 如果有上传logo，使用第一个文件的URL
      if (fileList.length > 0 && fileList[0].url) {
        values.logo = fileList[0].url;
      }
      onSubmit({
        ...values,
        status: 'pending' // 新提交的公司信息默认为pending状态
      });
      form.resetFields();
      setFileList([]);
      onClose();
      Message.success('提交成功');
    } catch (error) {
      Message.error('表单验证失败，请检查必填项');
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

        <FormItem label="公司地址" field="address">
          <Input placeholder="请输入公司地址" />
        </FormItem>

        <FormItem label="成立时间" field="establishedDate">
          <DatePicker style={{ width: '100%' }} />
        </FormItem>

        <FormItem label="主营业务" field="mainBusiness">
          <Input placeholder="请输入主营业务" />
        </FormItem>

        <FormItem label="员工人数" field="employeeCount">
          <InputNumber
            min={0}
            step={100}
            style={{ width: '100%' }}
            placeholder="请输入员工人数"
          />
        </FormItem>

        <FormItem label="公司规模评级" field="scaleRating">
          <InputNumber
            min={1}
            max={5}
            style={{ width: '100%' }}
            placeholder="请输入公司规模评级(1-5)"
          />
        </FormItem>

        <FormItem label="认证状态" field="isVerified" initialValue={false}>
          <Radio.Group>
            <Radio value={true}>已认证</Radio>
            <Radio value={false}>未认证</Radio>
          </Radio.Group>
        </FormItem>

        <FormItem label="公司简介" field="description">
          <TextArea
            placeholder="请输入公司简介"
            maxLength={500}
            showWordLimit
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CompanyFormModal; 