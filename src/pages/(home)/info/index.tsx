import { useState } from 'react';
import { Table, Tag, Button, Input } from '@arco-design/web-react';
import { IconRight } from '@arco-design/web-react/icon';
import SalaryCalculator from '@/components/salary-calculator';
import salaryGIF from '@/assets/salary.gif';
import './style.css';
import { Tabs, Typography } from '@arco-design/web-react';
const TabPane = Tabs.TabPane;

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
  const [activeTab, setActiveTab] = useState('发动态');


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
      title: '网申',
      dataIndex: 'online',
      render: (online: CompanySchedule['online']) => (
        <div className="schedule-cell">
          <div>{online.date}</div>
          {online.link && (
            <Button type="text" className="link-button">
              {online.link}
            </Button>
          )}
        </div>
      ),
    },
    {
      title: '笔试',
      dataIndex: 'written',
      render: (written: CompanySchedule['written']) => (
        <div className="schedule-cell">
          <div>{written.date}</div>
          {written.note && <div className="note">{written.note}</div>}
        </div>
      ),
    },
    {
      title: '面试',
      dataIndex: 'interview',
      render: (interview: CompanySchedule['interview']) => (
        <div className="schedule-cell">
          <div>{interview.date}</div>
          {interview.note && <div className="note">{interview.note}</div>}
        </div>
      ),
    },
    {
      title: 'offer',
      dataIndex: 'offer',
      render: (offer: CompanySchedule['offer']) => (
        <div className="schedule-cell">
          <div>{offer.date}</div>
          {offer.note && <div className="note">{offer.note}</div>}
        </div>
      ),
    },
  ];

  return (
    <div className="info-container">
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        className="article-tabs"
      >
        <TabPane key="发动态" title={<span className="px-2">发动态</span>} />
        <TabPane key="写文章" title={<span className="px-2">写文章</span>} />
        <TabPane key="发内推" title={<span className="px-2">发内推</span>} />
      </Tabs>

      <div className="search-box">
        <div className="search-wrapper">
          <Input
            placeholder="请输入公司/岗位名称"
            value={searchValue}
            onChange={setSearchValue}
            className="search-input"
            suffix={<Button type="primary">GO→</Button>}
          />
          <div className="search-tags">
            <Tag>华为</Tag>
            <Tag>好未来</Tag>
            <Tag>字节</Tag>
          </div>
        </div>
        <div className="tool-box">
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