import { useState } from 'react';
import { Modal, Input, Select, Button, Radio, InputNumber, Table, Tabs } from '@arco-design/web-react';
import { IconEye } from '@arco-design/web-react/icon';
import './style.css';

const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

// 社保基数上下限（以北京为例）
const SOCIAL_INSURANCE_BASE = {
  min: 3613,
  max: 31884
};

// 公积金基数上下限（以北京为例）
const HOUSING_FUND_BASE = {
  min: 2320,
  max: 31884
};

// 个税起征点
const TAX_THRESHOLD = 5000;

// 个税梯度
const TAX_BRACKETS = [
  { threshold: 0, rate: 0.03, deduction: 0 },
  { threshold: 3000, rate: 0.1, deduction: 210 },
  { threshold: 12000, rate: 0.2, deduction: 1410 },
  { threshold: 25000, rate: 0.25, deduction: 2660 },
  { threshold: 35000, rate: 0.3, deduction: 4410 },
  { threshold: 55000, rate: 0.35, deduction: 7160 },
  { threshold: 80000, rate: 0.45, deduction: 15160 }
];

interface InsuranceDetail {
  name: string;
  base: number;
  personalRate: number;
  personalAmount: number;
  companyRate: number;
  companyAmount: number;
  total: number;
}

interface SalaryCalculatorProps {
  visible: boolean;
  onClose: () => void;
}

const cities = [
  { label: '杭州市', value: 'hangzhou' },
  { label: '北京市', value: 'beijing' },
  { label: '上海市', value: 'shanghai' },
  { label: '深圳市', value: 'shenzhen' },
  { label: '广州市', value: 'guangzhou' },
];

const bonusMultiples = [1, 2, 3, 4, 6, 8, 10];

export const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({ visible, onClose }) => {
  const [city, setCity] = useState<string>('beijing');
  const [preTaxSalary, setPreTaxSalary] = useState<string>('');
  const [taxType, setTaxType] = useState<string>('separate');
  const [bonus, setBonus] = useState<string>('');
  const [socialBase, setSocialBase] = useState<string>('4462');
  const [housingBase, setHousingBase] = useState<string>('2490');
  const [housingRate, setHousingRate] = useState<string>('12');
  const [activeTab, setActiveTab] = useState<string>('result');

  const [afterTaxMonthly, setAfterTaxMonthly] = useState<number>(0);
  const [socialInsurance, setSocialInsurance] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [housingFund, setHousingFund] = useState<number>(0);
  const [insuranceDetails, setInsuranceDetails] = useState<InsuranceDetail[]>([]);

  // 计算社保公积金明细
  const calculateInsuranceDetails = (salary: number): InsuranceDetail[] => {
    const base = Math.min(Math.max(salary, SOCIAL_INSURANCE_BASE.min), SOCIAL_INSURANCE_BASE.max);
    const details: InsuranceDetail[] = [
      {
        name: '养老保险',
        base,
        personalRate: 0.08,
        personalAmount: base * 0.08,
        companyRate: 0.16,
        companyAmount: base * 0.16,
        total: base * (0.08 + 0.16)
      },
      {
        name: '医疗保险',
        base,
        personalRate: 0.02,
        personalAmount: base * 0.02 + 3, // 包含大病医疗3元
        companyRate: 0.09,
        companyAmount: base * 0.09,
        total: base * (0.02 + 0.09) + 3
      },
      {
        name: '失业保险',
        base,
        personalRate: 0.002,
        personalAmount: base * 0.002,
        companyRate: 0.008,
        companyAmount: base * 0.008,
        total: base * (0.002 + 0.008)
      },
      {
        name: '工伤保险',
        base,
        personalRate: 0,
        personalAmount: 0,
        companyRate: 0.004, // 假设为中等风险行业
        companyAmount: base * 0.004,
        total: base * 0.004
      },
      {
        name: '生育保险',
        base,
        personalRate: 0,
        personalAmount: 0,
        companyRate: 0.008,
        companyAmount: base * 0.008,
        total: base * 0.008
      },
      {
        name: '住房公积金',
        base: Math.min(Math.max(salary, HOUSING_FUND_BASE.min), HOUSING_FUND_BASE.max),
        personalRate: Number(housingRate) / 100,
        personalAmount: base * Number(housingRate) / 100,
        companyRate: Number(housingRate) / 100,
        companyAmount: base * Number(housingRate) / 100,
        total: base * Number(housingRate) / 50
      }
    ];
    return details;
  };

  // 计算个税
  const calculateTax = (taxableIncome: number): number => {
    for (let i = TAX_BRACKETS.length - 1; i >= 0; i--) {
      if (taxableIncome > TAX_BRACKETS[i].threshold) {
        return taxableIncome * TAX_BRACKETS[i].rate - TAX_BRACKETS[i].deduction;
      }
    }
    return 0;
  };

  const handleCalculate = () => {
    const salary = Number(preTaxSalary) || 0;
    const details = calculateInsuranceDetails(salary);
    
    // 计算社保公积金总额
    const totalInsurance = details.reduce((sum, item) => sum + item.personalAmount, 0);
    
    // 计算应纳税所得额
    const taxableIncome = salary - totalInsurance - TAX_THRESHOLD;
    
    // 计算个税
    const taxAmount = calculateTax(Math.max(0, taxableIncome));

    setInsuranceDetails(details);
    setSocialInsurance(totalInsurance - details[5].personalAmount); // 不包含公积金
    setHousingFund(details[5].personalAmount);
    setTax(taxAmount);
    setAfterTaxMonthly(salary - totalInsurance - taxAmount);
  };

  return (
    <Modal
      title={null}
      visible={visible}
      onCancel={onClose}
      footer={null}
      className="salary-calculator-modal"
    >
      <div className="calculator-container">
        <div className="result-section">
          <div className="total-amount">
            <span className="label">税后月薪</span>
            <span className="value">¥ {afterTaxMonthly.toFixed(1)}</span>
          </div>
          <div className="detail-items">
            <div className="detail-item">
              <span>个人所得税</span>
              <span>¥ {tax}</span>
            </div>
            <div className="detail-item">
              <span>社保缴纳</span>
              <span>¥ {socialInsurance}</span>
            </div>
            <div className="detail-item">
              <span>公积金缴纳</span>
              <span>¥ {housingFund}</span>
            </div>
          </div>
        </div>

        <div className="input-section">
          <Tabs activeTab={activeTab} onChange={setActiveTab}>
            <TabPane key="result" title="基本信息">
              <div className="input-group">
                <div className="input-group-title">基本信息</div>
                <div className="input-row">
                  <div className="input-item">
                    <div className="label">税前月薪</div>
                    <Input
                      placeholder="请输入月薪"
                      value={preTaxSalary}
                      onChange={setPreTaxSalary}
                      suffix={<Button type="text" onClick={handleCalculate}>计算</Button>}
                    />
                  </div>
                  <div className="input-item">
                    <div className="label">工作城市</div>
                    <Select value={city} onChange={setCity} style={{ width: '100%' }}>
                      {cities.map(city => (
                        <Option key={city.value} value={city.value}>
                          {city.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="input-group">
                <div className="input-group-title">社保公积金</div>
                <div className="input-row">
                  <div className="input-item">
                    <div className="label">
                      社保缴纳类型
                      <IconEye className="info-icon" />
                    </div>
                    <Select defaultValue="standard" style={{ width: '100%' }}>
                      <Option value="standard">按照工资</Option>
                      <Option value="base">按照基数</Option>
                    </Select>
                  </div>
                  <div className="input-item">
                    <div className="label">社保缴纳基数</div>
                    <InputNumber
                      value={socialBase}
                      onChange={val => setSocialBase(String(val))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-item">
                    <div className="label">公积金缴纳基数</div>
                    <InputNumber
                      value={housingBase}
                      onChange={val => setHousingBase(String(val))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="input-item">
                    <div className="label">公积金缴纳比例</div>
                    <Select
                      value={housingRate}
                      onChange={setHousingRate}
                      style={{ width: '100%' }}
                    >
                      <Option value="12">12%</Option>
                      <Option value="10">10%</Option>
                      <Option value="8">8%</Option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="input-group">
                <div className="input-group-title">年终奖</div>
                <div className="input-row">
                  <div className="input-item">
                    <div className="label">计税方式</div>
                    <RadioGroup value={taxType} onChange={setTaxType}>
                      <Radio value="separate">单独计税</Radio>
                      <Radio value="together">并入年薪</Radio>
                    </RadioGroup>
                  </div>
                </div>
                <div className="input-row">
                  <div className="input-item">
                    <div className="label">年终奖倍数</div>
                    <div className="bonus-section">
                      {bonusMultiples.map(multiple => (
                        <Button
                          key={multiple}
                          type={bonus === String(multiple) ? 'primary' : 'default'}
                          onClick={() => setBonus(String(multiple))}
                        >
                          ×{multiple}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane key="detail" title="缴费明细">
              <Table
                columns={[
                  { 
                    title: '项目', 
                    dataIndex: 'name',
                    align: 'left',
                    width: 100
                  },
                  { 
                    title: '缴费基数', 
                    dataIndex: 'base', 
                    align: 'right',
                    width: 120,
                    render: (value: number) => value.toFixed(2)
                  },
                  { 
                    title: '个人部分',
                    align: 'center',
                    children: [
                      { 
                        title: '比例', 
                        dataIndex: 'personalRate',
                        align: 'center',
                        width: 80,
                        render: (value: number) => (value * 100).toFixed(1) + '%'
                      },
                      { 
                        title: '金额', 
                        dataIndex: 'personalAmount',
                        align: 'right',
                        width: 100,
                        render: (value: number) => value.toFixed(2)
                      }
                    ]
                  },
                  { 
                    title: '单位部分',
                    align: 'center',
                    children: [
                      { 
                        title: '比例', 
                        dataIndex: 'companyRate',
                        align: 'center',
                        width: 80,
                        render: (value: number) => (value * 100).toFixed(1) + '%'
                      },
                      { 
                        title: '金额', 
                        dataIndex: 'companyAmount',
                        align: 'right',
                        width: 100,
                        render: (value: number) => value.toFixed(2)
                      }
                    ]
                  },
                  { 
                    title: '合计', 
                    dataIndex: 'total',
                    align: 'right',
                    width: 120,
                    render: (value: number) => value.toFixed(2)
                  }
                ]}
                data={insuranceDetails}
                pagination={false}
                className="detail-table"
                border={{ wrapper: true, cell: true }}
                size="small"
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>
  );
};

export default SalaryCalculator;