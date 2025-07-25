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
import { apiConfig } from '@/config';
import { IconSubscribeAdd } from '@arco-design/web-react/icon';
import dayjs from 'dayjs';

type FilterKeys = 'companyName' | 'employeeCount' | 'mainBusiness' | 'address';

interface Itags {
  key: FilterKeys;
  label: string;
  tags: string[];
}

type FilterType = {
  [K in FilterKeys]: string[];
}

const searchTags: Itags[] = [
  {
    label: '热门公司',
    key: 'companyName',
    tags: ['华为', '好未来', '字节'],
  },
  {
    label: '人数规模',
    key: 'employeeCount',
    tags: ['1-99', '100-999', '1000-9999', '9999+'],
  },
  {
    label: '主营业务',
    key: 'mainBusiness',
    tags: ['互联网', '科技', '教育', '金融'],
  },
  {
    label: '办公地点',
    key: 'address',
    tags: ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '苏州'],
  },
]

const Info = () => {
  const [searchValue, setSearchValue] = useState(''); // 搜索值(暂存)
  const [searchKeyword, setSearchKeyword] = useState(''); // 搜索关键词(实际搜索值)
  const [filter, setFilter] = useState<FilterType>({
    companyName: [],
    employeeCount: [],
    mainBusiness: [],
    address: [],
  });
  const [calculatorVisible, setCalculatorVisible] = useState(false);
  const [companyFormVisible, setCompanyFormVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const navigate = useNavigate();

  const { data: companyList } = useQuery({
    queryKey: ['companyList', pagination.current, pagination.pageSize, searchKeyword, filter],
    queryFn: () => getCompanyListApi({
      page: pagination.current,
      pageSize: pagination.pageSize,
      keyword: searchValue,
      mainBusiness: filter.mainBusiness.length > 0 ? filter.mainBusiness : undefined,
      employeeCount: filter.employeeCount.length > 0 ? filter.employeeCount : undefined,
      address: filter.address.length > 0 ? filter.address : undefined,
      companyName: filter.companyName.length > 0 ? filter.companyName : undefined,
    }).then(res => {
      setPagination(prev => ({
        ...prev,
        total: res.data.total
      }));
      return res.data;
    })
  })



  const columns = [
    {
      title: '公司',
      dataIndex: 'name',
      width: 100,
      render: (_: any, record: ICompany) => (
        <div className="company-cell hover:cursor-pointer hover:text-blue-600" onClick={() => navigate(`/navigator/info/company?companyId=${record.id}`)}>
          <img src={apiConfig.baseUrl + record.logo || ''} alt={record.name} className="company-logo" />
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
      title: '成立时间',
      width: 120,
      dataIndex: 'establishedDate',
      render: (establishedDate: string) => (
        <span className="schedule-cell  line-clamp-1">
          {establishedDate ? dayjs(establishedDate).format('YYYY-MM-DD') : '暂无'}
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
      title: '主营业务',
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
      title: '投递链接',
      width: 120,
      dataIndex: 'metadata',
      render: (metadata: any) => (
        <span className="schedule-cell line-clamp-1 hover:cursor-pointer text-blue-600" onClick={() => window.open(metadata.website, '_blank')}>
          {metadata.website}
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
            onChange={(value) => {
              setSearchValue(value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearchKeyword(searchValue);
                setPagination(prev => ({
                  ...prev,
                  current: 1,
                }));
              }
            }}
            className="search-input"
            style={{ paddingRight: '0px !important' }}
            suffix={<Button type="primary" className="absolute right-0 top-0">GO→</Button>}
          />
          <div className='gap-2 mt-4 hidden md:block'>
            {
              searchTags.map((item: Itags) => (
                <div className="line-clamp-1 mt-2">
                  <span className="search-tags-title mr-4 text-nowrap">{item.label}:</span>
                  {item.tags.map((tag, index) => (
                    <Tag key={index}
                      className={`${filter[item.key].find((item: string) => item === tag) || searchValue === tag ? 'bg-blue-600 text-white' : ''} cursor-default ml-2`}
                      onClick={() => {
                        if (item.key === 'companyName') {
                          if (searchValue === tag) {
                            setSearchValue('')
                            setSearchKeyword('')
                          } else {
                            setSearchValue(tag)
                            setSearchKeyword(tag)
                          }
                        }
                        else if (filter[item.key].find((item: string) => item === tag)) {
                          setFilter({ ...filter, [item.key]: filter[item.key].filter((item: string) => item !== tag) });
                        } else {
                          setFilter({ ...filter, [item.key]: [...filter[item.key], tag] });
                        }
                        setPagination(prev => ({
                          ...prev,
                          current: 1,
                        }));

                      }}>{tag}</Tag>
                  ))}
                </div>
              ))}
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
                  <span>公司收录 <IconSubscribeAdd /></span>
                  <span className="sub">前往添加公司信息</span>
                </div>
              </Button>
              <Button className="tool-button small">
                <div className="button-content" onClick={() => window.open('https://www.mujicv.com/', '_blank')}>
                  <span>简历制作</span>
                  <span className="sub">以简单的方式写好简历</span>
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
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (current, pageSize) => {
            setPagination(prev => ({
              ...prev,
              current,
              pageSize
            }));
          }
        }}
        className="schedule-table"
        rowKey="id"
      />
    </div>
  );
};

export default Info;