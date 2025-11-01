import { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, Radio, InputNumber, Table, Tabs, Message } from '@arco-design/web-react';
import { IconEye } from '@arco-design/web-react/icon';
import { useDebounce } from '@/hooks/useDebounce';

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
  const [socialType, setSocialType] = useState<string>('standard');
  const [afterTaxMonthly, setAfterTaxMonthly] = useState<number>(0);
  const [socialInsurance, setSocialInsurance] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [housingFund, setHousingFund] = useState<number>(0);
  const [insuranceDetails, setInsuranceDetails] = useState<InsuranceDetail[]>([]);
  const [afterTaxBonus, setAfterTaxBonus] = useState<number>(0);

  // 计算社保公积金明细
  const calculateInsuranceDetails = (salary: number): InsuranceDetail[] => {
    // 根据缴纳类型确定社保基数
    let actualSocialBase = socialType === 'standard' 
      ? Math.min(Math.max(salary, SOCIAL_INSURANCE_BASE.min), SOCIAL_INSURANCE_BASE.max)
      : Math.min(Math.max(Number(socialBase), SOCIAL_INSURANCE_BASE.min), SOCIAL_INSURANCE_BASE.max);

    // 根据缴纳类型确定公积金基数
    let actualHousingBase = socialType === 'standard'
      ? Math.min(Math.max(salary, HOUSING_FUND_BASE.min), HOUSING_FUND_BASE.max)
      : Math.min(Math.max(Number(housingBase), HOUSING_FUND_BASE.min), HOUSING_FUND_BASE.max);

    const details: InsuranceDetail[] = [
      {
        name: '养老保险',
        base: actualSocialBase,
        personalRate: 0.08,
        personalAmount: actualSocialBase * 0.08,
        companyRate: 0.16,
        companyAmount: actualSocialBase * 0.16,
        total: Number((actualSocialBase * (0.08 + 0.16)).toFixed(2))
      },
      {
        name: '医疗保险',
        base: actualSocialBase,
        personalRate: 0.02,
        personalAmount: actualSocialBase * 0.02 + 3,
        companyRate: 0.09,
        companyAmount: actualSocialBase * 0.09,
        total: Number((actualSocialBase * (0.02 + 0.09) + 3).toFixed(2))
      },
      {
        name: '失业保险',
        base: actualSocialBase,
        personalRate: 0.002,
        personalAmount: actualSocialBase * 0.002,
        companyRate: 0.008,
        companyAmount: actualSocialBase * 0.008,
        total: Number((actualSocialBase * (0.002 + 0.008)).toFixed(2))
      },
      {
        name: '工伤保险',
        base: actualSocialBase,
        personalRate: 0,
        personalAmount: 0,
        companyRate: 0.004,
        companyAmount: actualSocialBase * 0.004,
        total: Number((actualSocialBase * 0.004).toFixed(2))
      },
      {
        name: '生育保险',
        base: actualSocialBase,
        personalRate: 0,
        personalAmount: 0,
        companyRate: 0.008,
        companyAmount: actualSocialBase * 0.008,
        total: Number((actualSocialBase * 0.008).toFixed(2))
      },
      {
        name: '住房公积金',
        base: actualHousingBase,
        personalRate: Number(housingRate) / 100,
        personalAmount: actualHousingBase * Number(housingRate) / 100,
        companyRate: Number(housingRate) / 100,
        companyAmount: actualHousingBase * Number(housingRate) / 100,
        total: Number((actualHousingBase * Number(housingRate) / 50).toFixed(2))
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

  // 计算年终奖个税
  const calculateBonusTax = (bonusAmount: number): number => {
    // 年终奖按月份平均后对应的税率和速算扣除数
    const monthlyBonus = bonusAmount / 12;
    for (let i = TAX_BRACKETS.length - 1; i >= 0; i--) {
      if (monthlyBonus > TAX_BRACKETS[i].threshold) {
        return bonusAmount * TAX_BRACKETS[i].rate - TAX_BRACKETS[i].deduction;
      }
    }
    return 0;
  };

  const handleCalculate = useDebounce(() => {
    const salary = Number(preTaxSalary) || 0;
    
    // 如果工资低于社保最低基数，给出提示
    if (salary < SOCIAL_INSURANCE_BASE.min && salary > 0) {
      Message.warning(`您的工资${salary}元低于社保最低基数${SOCIAL_INSURANCE_BASE.min}元，将按最低基数缴纳社保`);
    }

    const details = calculateInsuranceDetails(salary);
    
    // 计算社保公积金总额
    const totalInsurance = Number(details.reduce((sum, item) => sum + item.personalAmount, 0).toFixed(2));
    
    // 计算应纳税所得额（如果扣除五险一金后低于个税起征点，则不需要缴纳个税）
    const afterInsurance = salary - totalInsurance;
    const taxableIncome = Math.max(0, afterInsurance - TAX_THRESHOLD);
    
    // 计算个税
    const taxAmount = Number(calculateTax(taxableIncome).toFixed(2));

    // 计算年终奖
    let bonusAfterTax = 0;
    if (bonus) {
      const bonusAmount = salary * Number(bonus);
      if (taxType === 'separate') {
        // 单独计税
        const bonusTax = calculateBonusTax(bonusAmount);
        bonusAfterTax = Number((bonusAmount - bonusTax).toFixed(2));
      } else {
        // 并入年薪计税
        const yearlyIncome = salary * 12;
        const yearlyTaxableIncome = Math.max(0, yearlyIncome - totalInsurance * 12 - TAX_THRESHOLD * 12);
        const totalTaxableIncome = yearlyTaxableIncome + bonusAmount;
        const totalTax = calculateTax(totalTaxableIncome);
        const normalTax = calculateTax(yearlyTaxableIncome);
        bonusAfterTax = Number((bonusAmount - (totalTax - normalTax)).toFixed(2));
      }
    }

    setInsuranceDetails(details);
    setSocialInsurance(Number((totalInsurance - details[5].personalAmount).toFixed(2))); // 不包含公积金
    setHousingFund(Number(details[5].personalAmount.toFixed(2)));
    setTax(taxAmount);
    
    // 确保税后工资不会出现负数
    const finalAfterTax = Math.max(0, afterInsurance - taxAmount);
    setAfterTaxMonthly(Number(finalAfterTax.toFixed(2)));
    setAfterTaxBonus(bonusAfterTax);
  },500)

  // 自动计算：监听所有相关状态变化
  useEffect(() => {
    // 只有当税前工资有值时才进行计算
    if (preTaxSalary && Number(preTaxSalary) > 0) {
      handleCalculate();
    } else {
      // 清空计算结果
      setAfterTaxMonthly(0);
      setSocialInsurance(0);
      setTax(0);
      setHousingFund(0);
      setInsuranceDetails([]);
      setAfterTaxBonus(0);
    }
  }, [preTaxSalary, city, taxType, bonus, socialBase, housingBase, housingRate, socialType]);

  return (
    <Modal
      title={null}
      visible={visible}
      onCancel={onClose}
      footer={null}
      className="w-[80vw] min-w-[360px] max-w-[1000px] max-h-4/5 flex  gap-5 p-5  flex-col  md:flex-row overflow-auto "
    >
      <div className="flex flex-col md:flex-row  overflow-auto">
        {/* 左侧结果区域 */}
        <div className="min-w-[280px] p-6 rounded-lg">
          <div className="text-center mb-5">
            <span className="block text-base text-gray-600 mb-2">税后月薪</span>
            <span className="text-3xl font-bold ">¥ {afterTaxMonthly.toFixed(1)}</span>
            {afterTaxBonus > 0 && (
              <div className="mt-2">
                <span className="block text-sm text-gray-600">税后年终奖</span>
                <span className="text-xl font-bold text-[#165DFF]">¥ {afterTaxBonus.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 ">
            <div className="bg-white p-4 rounded-lg flex justify-between items-center md:flex-col md:text-center md:p-3">
              <span className="text-sm text-gray-600">个人所得税</span>
              <span className="text-lg text-gray-800 font-medium">¥ {tax}</span>
            </div>
            <div className="bg-white p-4 rounded-lg flex justify-between items-center md:flex-col md:text-center md:p-3">
              <span className="text-sm text-gray-600">社保缴纳</span>
              <span className="text-lg text-gray-800 font-medium">¥ {socialInsurance}</span>
            </div>
            <div className="bg-white p-4 rounded-lg flex justify-between items-center md:flex-col md:text-center md:p-3">
              <span className="text-sm text-gray-600">公积金缴纳</span>
              <span className="text-lg text-gray-800 font-medium">¥ {housingFund}</span>
            </div>
          </div>
        </div>

        {/* 右侧表单区域 */}
        <div className="flex-1 ">
          <Tabs activeTab={activeTab} onChange={setActiveTab} className="h-full flex flex-col">
            <TabPane key="result" title="基本信息">
              <div className="mb-6">
                <div className="text-base font-medium text-gray-800 mb-4 pl-3 border-l-4 border-[#165DFF]">基本信息</div>
                <div className="grid grid-cols-2 gap-4 mb-4 ">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">税前月薪</div>
                    <Input
                      placeholder="请输入月薪"
                      value={preTaxSalary}
                      onChange={setPreTaxSalary}
                      className=""
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">工作城市</div>
                    <Select 
                      value={city} 
                      onChange={setCity} 
                      className="w-full "
                    >
                      {cities.map(city => (
                        <Option key={city.value} value={city.value}>
                          {city.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-base font-medium text-gray-800 mb-4 pl-3 border-l-4 border-[#165DFF]">社保公积金</div>
                <div className="grid grid-cols-2 gap-4 mb-4 ">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2 flex items-center">
                      社保缴纳类型
                      <IconEye className="ml-1 text-[#86909c] cursor-pointer" />
                    </div>
                    <Select 
                      value={socialType}
                      onChange={setSocialType}
                      className="w-full"
                    >
                      <Option value="standard">按照工资</Option>
                      <Option value="base">按照基数</Option>
                    </Select>
                  </div>
                  {socialType === 'base' && (
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-2">社保缴纳基数</div>
                      <InputNumber
                        value={socialBase}
                        onChange={val => setSocialBase(String(val))}
                        min={SOCIAL_INSURANCE_BASE.min}
                        max={SOCIAL_INSURANCE_BASE.max}
                        className="w-full "
                      />
                    </div>
                  )}
                </div>
                {socialType === 'base' && (
                  <div className="grid grid-cols-2 gap-4 mb-4 ">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-2">公积金缴纳基数</div>
                      <InputNumber
                        value={housingBase}
                        onChange={val => setHousingBase(String(val))}
                        min={HOUSING_FUND_BASE.min}
                        max={HOUSING_FUND_BASE.max}
                        className="w-full "
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-2">公积金缴纳比例</div>
                      <Select
                        value={housingRate}
                        onChange={setHousingRate}
                        className="w-full "
                      >
                        <Option value="12">12%</Option>
                        <Option value="10">10%</Option>
                        <Option value="8">8%</Option>
                        <Option value="5">5%</Option>
                      </Select>
                    </div>
                  </div>
                )}
                {socialType === 'standard' && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-2">公积金缴纳比例</div>
                      <Select
                        value={housingRate}
                        onChange={setHousingRate}
                        className="w-full "
                      >
                        <Option value="12">12%</Option>
                        <Option value="10">10%</Option>
                        <Option value="8">8%</Option>
                        <Option value="5">5%</Option>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="text-base font-medium text-gray-800 mb-4 pl-3 border-l-4 border-[#165DFF]">年终奖</div>
                <div className="flex">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">计税方式</div>
                    <RadioGroup value={taxType} onChange={setTaxType}>
                      <Radio value="separate">单独计税</Radio>
                      <Radio value="together">并入年薪</Radio>
                    </RadioGroup>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">年终奖倍数</div>
                    <div className="flex gap-2 flex-wrap">
                      {bonusMultiples.map(multiple => (
                        <Button
                          key={multiple}
                          type={bonus === String(multiple) ? 'primary' : 'default'}
                          onClick={() => setBonus(String(multiple))}
                          className="flex-1 min-w-[60px]"
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
                    render: (value: number) => value.toFixed(1)
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
                        render: (value: number) => value.toFixed(1)
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
                    render: (value: number) => value.toFixed(1)
                  }
                ]}
                data={insuranceDetails}
                pagination={false}
                className="mt-4 rounded-lg overflow-hidden [&_.arco-table-th]:!bg-gradient-to-br [&_.arco-table-th]:!from-[#f6f9fe] [&_.arco-table-th]:!to-[#f0f4f9] [&_.arco-table-th]:!font-medium [&_.arco-table-th]:!text-[#1D2129] [&_.arco-table-th]:!h-12 [&_.arco-table-th]:!p-3 [&_.arco-table-th]:!text-sm [&_.arco-table-td]:!h-13 [&_.arco-table-td]:!p-3 [&_.arco-table-td]:!text-[#4E5969] [&_.arco-table-td]:!text-sm [&_.arco-table-td]:!transition-all [&_.arco-table-tr:hover_.arco-table-td]:!bg-[#F2F3F5] [&_.arco-table-border]:!border [&_.arco-table-border]:!border-[#E5E6EB] [&_.arco-table-border]:!rounded-lg [&_.arco-table-border-cell_.arco-table-th]:!border-r [&_.arco-table-border-cell_.arco-table-th]:!border-[#E5E6EB] [&_.arco-table-border-cell_.arco-table-td]:!border-r [&_.arco-table-border-cell_.arco-table-td]:!border-[#E5E6EB] [&_.arco-table-tr:last-child_.arco-table-td]:!border-b-0 [&_.arco-table-td[style*='text-align:_right']]:!font-['Roboto_Mono'] [&_.arco-table-td[style*='text-align:_right']]:!font-medium [&_.arco-table-td[style*='text-align:_right']]:!text-[#1D2129] [&_.arco-table-td[style*='text-align:_center']]:!text-[#86909C] [&_.arco-table-td:last-child]:!text-[#165DFF] [&_.arco-table-td:last-child]:!font-medium [&_.arco-table-header-group]:!bg-gradient-to-br [&_.arco-table-header-group]:!from-[#f6f9fe] [&_.arco-table-header-group]:!to-[#f0f4f9] [&_.arco-table-header-group_.arco-table-th]:!bg-transparent [&_.arco-table-header-group_.arco-table-th]:!h-10 [&_.arco-table-header-group_.arco-table-th]:!font-semibold [&_.arco-table-header-group_.arco-table-th]:!text-[#1D2129] [&_.arco-table-cell]:!flex [&_.arco-table-cell]:!items-center [&_.arco-table-cell]:!justify-start [&_.arco-table-cell[style*='text-align:_right']]:!justify-end [&_.arco-table-cell[style*='text-align:_center']]:!justify-center [&_.arco-table-tr:nth-child(even)_.arco-table-td]:!bg-[#FAFBFC] [&_.arco-table-tr:hover_.arco-table-td]:!bg-[#F2F3F5]"
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