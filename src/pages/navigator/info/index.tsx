import { useState } from 'react';
import { Table, Tag, Button, Input } from '@arco-design/web-react';
import SalaryCalculator from '@/components/salary-calculator';
import CompanyFormModal from '@/components/company-form-modal';
import salaryGIF from '@/assets/salary.gif';
import './style.css';
import { getCompanyListApi } from '@/service/company';
import { useQuery } from '@tanstack/react-query';
import { ICompany } from '@/types/company';
import { useNavigate } from 'react-router-dom';

const Info = () => {
  const [searchValue, setSearchValue] = useState('');
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [companyFormVisible, setCompanyFormVisible] = useState(false);
  const navigate = useNavigate();

  const { data: companyList } = useQuery({
    queryKey: ['companyList'],
    queryFn: () => getCompanyListApi().then(res => res.data),
  })



  const columns = [
    {
      title: '公司',
      dataIndex: 'name',
      width: 100,
      render: (_: any, record: ICompany) => (
        <div className="company-cell" onClick={() => navigate(`/navigator/info/company?${record.id}`)}>
          <img src={record.logo || ''} alt={record.name} className="company-logo" />
          <span className=' line-clamp-1'>{record.name}</span>
        </div>
      ),
    },
    {
      title: '人数规模',
      width: 120,
      dataIndex: 'employeeCount',
      render: (employeeCount: string) => (
        <span className="schedule-cell  line-clamp-1">
          {employeeCount}
        </span>
      ),
    },
    {
      title: '办公地点',
      width: 120,
      dataIndex: 'address',
      render: (address: string[]) => (
        <span className="schedule-cell line-clamp-1">
          {address.length > 0 && Array.isArray(address) ?
            <> {address.join(',')}</>
            : '暂无'}
        </span>
      ),
    },
    {
      title: '技术岗位',
      width: 120,
        dataIndex: 'mainBusiness',
      render: (mainBusiness: string) => (
        <span className="schedule-cell line-clamp-1">
          {mainBusiness.length > 0 && Array.isArray(mainBusiness) ?
            <> {mainBusiness.join(',')}</>
            : '暂无'}
        </span>
      ),
    },
    {
      title: '状态',
      width: 120,
      dataIndex: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>{status ? '已认证' : '未认证'}</Tag>
      ),
    }
    // {
    //   title:'更新时间',
    //   dataIndex: 'updatedAt',
    //   render: (updatedAt: string) => (
    //     <div className="schedule-cell">
    //       <div>{updatedAt}</div>
    //     </div>
    //   ),
    // },
    // {
    //   title:'投递链接',
    //   dataIndex: 'metadata',
    //   render: (metadata: string) => (
    //     <div className="schedule-cell">
    //       <div>{metadata}</div>
    //     </div>
    //   ),
    // }

  ];

  const handleCompanySubmit = (values: any) => {
    console.log('提交的公司信息:', values);
    // TODO: 这里添加提交到后端的逻辑
  };

  return (
    <div className="info-container">

      <div className="search-box flex md:flex-nowrap flex-wrap">
        <div className="search-wrapper">
          <Input
            placeholder="请输入公司/岗位名称"
            value={searchValue}
            onChange={setSearchValue}
            className="search-input"
            style={{ paddingRight: '0px !important' }}
            suffix={<Button type="primary" className="absolute right-0 top-0">GO→</Button>}
          />
          <div className="search-tags">
            <Tag>华为</Tag>
            <Tag>好未来</Tag>
            <Tag>字节</Tag>
          </div>
        </div>
        <div className="tool-box md:w-[300px] w-full ">
          <div className="tool-title">求职工具箱</div>
          <div className="tool-buttons">
            <Button
              className="tool-button"
              onClick={() => setCalculatorVisible(true)}
            >
              <div className="button-content">
                <span className=' font-bold '>薪资计算器</span>
                <span className="">在线计算真实到手薪资💰</span>
                <img src={salaryGIF} alt="salary" className="tool-icon w-20 h-20 absolute right-0 top-0" />
              </div>
            </Button>
            <div className="tool-group">
              <Button
                className="tool-button small"
                onClick={() => setCompanyFormVisible(true)}
              >
                <div className="button-content">
                  <span>公司收录</span>
                  <span className="sub">前往添加公司信息</span>
                </div>
              </Button>
              <Button className="tool-button small">
                <div className="button-content">
                  <span>找校招</span>
                  <span className="sub">4W+职位直投官网</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SalaryCalculator
        visible={calculatorVisible}
        onClose={() => setCalculatorVisible(false)}
      />

      <CompanyFormModal
        visible={companyFormVisible}
        onClose={() => setCompanyFormVisible(false)}
        onSubmit={handleCompanySubmit}
      />

      <Table
        columns={columns}
        data={companyList?.companies || []}
        pagination={false}
        className="schedule-table"
        rowKey="id"
      />
    </div>
  );
};

export default Info;