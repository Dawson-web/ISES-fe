import { useState } from 'react';
import { Table, Tag, Button, Input } from '@arco-design/web-react';
import SalaryCalculator from '@/components/salary-calculator';
import salaryGIF from '@/assets/salary.gif';
import './style.css';

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


  const columns = [
    {
      title: '公司',
      dataIndex: 'company',
      render: (_: any, record: CompanySchedule) => (
        <div className="company-cell">
          <img src={record.logo} alt={record.name} className="company-logo" />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: '内推',
      dataIndex: 'internal',
      render: (internal: CompanySchedule['internal']) => (
        <div className="schedule-cell">
          <div>{internal.date}</div>
          {internal.link && (
            <Button type="text" className="link-button">
              {internal.link}
            </Button>
          )}
        </div>
      ),
    },
    {
      title:'工作地点',
      dataIndex: 'location',
      render: (location: string) => (
        <div className="schedule-cell">
          <div>{location}</div>
        </div>
      ),
    },
    {
      title:'招聘类型',
      dataIndex: 'type',
      render: (type: string) => (
        <div className="schedule-cell">
          <div>{type}</div>
        </div>
      ),
    },
    {
      title:'招聘对象',
      dataIndex: 'object',
      render: (object: string) => (
        <div className="schedule-cell">
          <div>{object}</div>
        </div>
      ),
    },
    {
      title:'岗位',
      dataIndex: 'job',
      render: (job: string) => (
        <div className="schedule-cell">
          <div>{job}</div>
        </div>
      ),
    },
    {
      title:'更新时间',
      dataIndex: 'time',
      render: (time: string) => (
        <div className="schedule-cell">
          <div>{time}</div>
        </div>
      ),
    },
    {
      title:'投递链接',
      dataIndex: 'link',
      render: (link: string) => (
        <div className="schedule-cell">
          <div>{link}</div>
        </div>
      ),
    }

  ];

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
              <Button className="tool-button small">
                <div className="button-content">
                  <span>找真题</span>
                  <span className="sub">5K+名企应届真题</span>
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

      <Table
        columns={columns}
        data={mockData}
        pagination={false}
        className="schedule-table"
        rowKey="id"
      />
    </div>
  );
};

export default Info;