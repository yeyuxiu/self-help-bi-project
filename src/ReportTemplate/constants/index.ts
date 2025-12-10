import { AggregateType } from '@/Data/mockData'
import { dimensions } from '@/Data/mockData'

// 指标选项
export const METRIC_OPTIONS = [
  { label: '销售额', value: 'sales' },
  { label: '订单数', value: 'orders' },
  { label: '用户数', value: 'users' },
  { label: '访问量', value: 'visits' },
  { label: '转化率', value: 'conversion' },
  { label: '客单价', value: 'avg_price' },
]

// 聚合函数选项
export const AGG_FUNC_OPTIONS: { label: string; value: AggregateType }[] = [
  { label: '求和', value: 'sum' },
  { label: '平均值', value: 'avg' },
  { label: '最大值', value: 'max' },
  { label: '最小值', value: 'min' },
  { label: '计数', value: 'count' },
]

// 时间周期选项
export const TIME_PERIOD_OPTIONS = [
  { label: '天', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
]

// 聚合类型选项
export const AGGREGATE_TYPE_OPTIONS = [
  { label: '维度', value: 'dimension' },
  { label: '时间', value: 'time' },
]

// 数值字段列表
export const NUMERIC_FIELDS = [
  'sales',
  'orders',
  'users',
  'avg_price',
  'visits',
  'conversion',
]

// 获取字段选项
export const getFieldOptions = () => {
  const metricFields = NUMERIC_FIELDS
  const dimensionFields = dimensions.map((d) => ({
    label: d.name,
    value: d.code,
  }))
  return [
    { label: '日期', value: 'date' },
    ...dimensionFields,
    ...metricFields.map((f) => ({ label: f, value: f })),
  ]
}

// 获取操作符选项
export const getOperatorOptions = (field: string) => {
  const isNumeric = NUMERIC_FIELDS.includes(field)
  const isDate = field === 'date'

  if (isDate) {
    return [
      { label: '等于', value: '=' },
      { label: '范围', value: 'in' },
    ]
  }

  if (isNumeric) {
    return [
      { label: '等于', value: '=' },
      { label: '不等于', value: '!=' },
      { label: '大于', value: '>' },
      { label: '小于', value: '<' },
      { label: '大于等于', value: '>=' },
      { label: '小于等于', value: '<=' },
    ]
  }

  return [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' },
    { label: '包含', value: 'contains' },
    { label: '属于', value: 'in' },
    { label: '不属于', value: 'not in' },
  ]
}

