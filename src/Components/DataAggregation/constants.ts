import { AggregateType } from '@/Data/mockData'

export const METRIC_OPTIONS = [
  { label: '销售额', value: 'sales' },
  { label: '订单数', value: 'orders' },
  { label: '用户数', value: 'users' },
  { label: '访问量', value: 'visits' },
  { label: '转化率', value: 'conversion' },
  { label: '客单价', value: 'avg_price' },
]

export const AGG_FUNC_OPTIONS: { label: string; value: AggregateType }[] = [
  { label: '求和', value: 'sum' },
  { label: '平均值', value: 'avg' },
  { label: '最大值', value: 'max' },
  { label: '最小值', value: 'min' },
  { label: '计数', value: 'count' },
]

export const AGGREGATE_TYPE_OPTIONS = [
  { label: '按维度聚合', value: 'dimension' },
  { label: '按时间聚合', value: 'time' },
]

