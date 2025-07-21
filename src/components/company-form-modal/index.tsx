import { Modal, Form, Input, DatePicker, Radio, Select, Rate, Space, Button } from '@arco-design/web-react';
import { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '@/store/User';
import { registerCompanyApi, uploadCompanyLogoApi } from '@/service/company';
import { toast } from 'sonner';
import { ICompany } from '@/types/company';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

interface CompanyFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: ICompany,file:File|null) => void;
  initialValues?: ICompany;
}

const EMPLOYEE_COUNT_OPTIONS = [
  { label: '1-99人', value: '1-99' },
  { label: '100-1000人', value: '100-1000' },
  { label: '1000-9999人', value: '1000-9999' },
  { label: '9999人以上', value: '9999+' }
];

const CompanyFormModal = observer(({ visible, onClose, onSubmit, initialValues }: CompanyFormModalProps) => {
  const [form] = Form.useForm<ICompany>();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = userStore.role === 1;
  const isEdit = !!initialValues;

  useEffect(() => {
    if (visible && initialValues) {
      const formValues = {
        ...initialValues,
        establishedDate: initialValues.establishedDate ? new Date(initialValues.establishedDate) : undefined
      };
      form.setFieldsValue(formValues);
    } else if (!visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);
  
  const uploadLogo = async (companyId:string,file:File) => {
    const formData = new FormData();
    formData.append('logo', file);
   await uploadCompanyLogoApi(formData, companyId)
}


  const handleSubmit = async () => {
    try {
      setUploading(true);
      const values = await form.validate();

      if (isEdit) {
        await onSubmit(values,file);
      } else {
        // 注册模式
        await registerCompanyApi({
          ...values,
          status: 'pending'
        }).then((res) => {
          if (file) {
            uploadLogo(res.data.id,file)
          }
          toast.success('提交成功');
          form.resetFields();
          onClose();
        }).catch(() => {
          toast.error('提交失败');
        });
      }
    } catch (error) {
      toast.error('操作失败，请检查表单内容');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);  
      console.log(selectedFile)
    }
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Modal
      title={isEdit ? "编辑公司信息" : "添加公司信息"}
      visible={visible}
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      confirmLoading={uploading}
      autoFocus={false}
      maskClosable={false}
    >
          <Space direction="vertical" style={{ width: '100%' }}>
            <input
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <Space>
              <Button onClick={() => fileInputRef.current?.click()}>
                选择文件
              </Button>
              {file && (
                <>
                  <span>{file.name}</span>
                  <Button type="text" status="danger" onClick={handleClearFile}>
                    清除
                  </Button>
                </>
              )}
            </Space>
          </Space>
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