import { useState } from 'react';
import { Table, Tag, Button, Input } from '@arco-design/web-react';
import SalaryCalculator from '@/components/salary-calculator';
import CompanyFormModal from '@/components/company-form-modal';
import salaryGIF from '@/assets/salary.gif';
import './style.css';
import { getCompanyListApi } from '@/service/company';
import { useQuery } from '@tanstack/react-query';
import { ICompany } from '@/types/company';

interface CompanySchedule {
  id: number;
  logo: string;
  name: string;
  internal: {
    date: string;
    link?: string;
  };
  online: {
    date: string;
    link?: string;
  };
  written: {
    date: string;
    note?: string;
  };
  interview: {
    date: string;
    note?: string;
  };
  offer: {
    date: string;
    note?: string;
  };
}

const mockData: CompanySchedule[] = [
  {
    id: 1,
    logo: 'https://static.nowcoder.com/images/res/logo/kuaishou.png',
    name: '快手',
    internal: {
      date: '内推',
      link: '投递链接'
    },
    online: {
      date: '网申',
      link: '投递链接'
    },
    written: {
      date: '笔试',
    },
    interview: {
      date: '面试',
    },
    offer: {
      date: 'offer'
    }
  },
  {
    id: 2,
    logo: 'https://static.nowcoder.com/images/res/logo/jd.png',
    name: '京东',
    internal: {
      date: '内推',
      link: '投递链接'
    },
    online: {
      date: '网申',
      link: '投递链接'
    },
    written: {
      date: '笔试',
      note: '简历通过后触发'
    },
    interview: {
      date: '面试',
      note: '测评/笔试后'
    },
    offer: {
      date: 'offer',
      note: '审批通过后随时...'
    }
  },
  {
    id: 3,
    logo: 'https://static.nowcoder.com/images/res/logo/hyundai.png',
    name: '现代汽车中国',
    internal: {
      date: '内推',
    },
    online: {
      date: '7月9日起',
      link: '投递链接'
    },
    written: {
      date: '7月21日',
    },
    interview: {
      date: '无',
    },
    offer: {
      date: '决赛通过后'
    }
  }
];

const Info = () => {
  const [searchValue, setSearchValue] = useState('');
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [companyFormVisible, setCompanyFormVisible] = useState(false);

  const {data: companyList} = useQuery({
    queryKey: ['companyList'],
    queryFn: () => getCompanyListApi().then(res => res.data),
  })



  const columns = [
    {
      title: '公司',
      dataIndex: 'name',
      render: (_: any, record: ICompany) => (
        <div className="company-cell">
          <img src={record.logo || ''} alt={record.name} className="company-logo" />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title:'规模',
      dataIndex: 'employeeCount',
      render: (employeeCount: string) => (
        <div className="schedule-cell">
          <div>{employeeCount}</div>
        </div>
      ),
    },
    {
      title:'办公地点',
      dataIndex: 'address',
      render: (address: string[]) => (
        <div className="schedule-cell">
          {address.length > 0 && Array.isArray(address) ? address?.map((item) => (
            <div >{item}</div>
          )) : '暂无'}
        </div>
      ),
    },
    {
      title:'技术岗位',
      dataIndex: 'mainBusiness',
      render: (mainBusiness: string) => (
        <div className="schedule-cell">
        {mainBusiness.length > 0 && Array.isArray(mainBusiness) ? mainBusiness?.map((item) => (
          <div >{item}</div>
        )) : '暂无'}
      </div>
      ),
    },
    {
      title:'状态',
      dataIndex: 'status',
      render: (status: boolean) => (
        <div className="schedule-cell">
          <Tag color={status ? 'green' : 'red'}>{status ? '已认证' : '未认证'}</Tag>
        </div>
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
            style={{paddingRight: '0px !important'}}
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
                <span className=' font-bold '>查薪资</span>
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
                  <span>公司未收录</span>
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