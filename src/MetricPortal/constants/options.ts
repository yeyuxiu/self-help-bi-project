import type { AggregateType, ChartType } from '../../Data/mockData'

export const METRIC_OPTIONS = [
  { label: '销售额', value: 'sales' },
  { label: '订单数', value: 'orders' },
  { label: '用户数', value: 'users' },
  { label: '访问量', value: 'visits' },
  { label: '转化率', value: 'conversion' },
  { label: '客单价', value: 'avg_price' },
]

export const NUMERIC_FIELDS = METRIC_OPTIONS.map((item) => item.value)

export const AGG_FUNC_OPTIONS: { label: string; value: AggregateType }[] = [
  { label: '求和', value: 'sum' },
  { label: '平均值', value: 'avg' },
  { label: '最大值', value: 'max' },
  { label: '最小值', value: 'min' },
  { label: '计数', value: 'count' },
]

export const AGGREGATE_TYPE_OPTIONS = [
  { label: '维度', value: 'dimension' },
  { label: '时间', value: 'time' },
]

export const TIME_PERIOD_OPTIONS = [
  { label: '天', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
]

export const TAB_ITEMS = [
  { key: 'chart', icon: 'BarChartOutlined', label: '图表视图' },
  { key: 'table', icon: 'TableOutlined', label: '表格视图' },
]

export const CHART_TYPE_OPTIONS: { label: string; value: ChartType }[] = [
  { label: '折线图', value: 'line' },
  { label: '柱状图', value: 'bar' },
  { label: '面积图', value: 'area' },
  { label: '饼图', value: 'pie' },
]

export const getFieldOptions = (dimensions: { name: string; code: string }[]) => {
  const dimensionFields = dimensions.map((d) => ({
    label: d.name,
    value: d.code,
  }))

  return [
    { label: '日期', value: 'date' },
    ...dimensionFields,
    ...NUMERIC_FIELDS.map((field) => ({ label: field, value: field })),
  ]
}

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

