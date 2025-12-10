import {
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  RiseOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  RadarChartOutlined,
} from '@ant-design/icons'
import { chartTypeOptions } from '@/Data/mockData'

// KPI 指标配置
export const KPI_METRICS = [
  { id: 'sales', name: '总销售额', icon: DollarOutlined, code: 'sales' },
  { id: 'orders', name: '订单数量', icon: ShoppingOutlined, code: 'orders' },
  { id: 'users', name: '用户数量', icon: UserOutlined, code: 'users' },
  { id: 'conversion', name: '转化率', icon: RiseOutlined, code: 'conversion' },
]

// 图表类型图标映射
export const CHART_TYPE_ICONS: Record<string, any> = {
  line: LineChartOutlined,
  bar: BarChartOutlined,
  pie: PieChartOutlined,
  area: AreaChartOutlined,
  radar: RadarChartOutlined,
}

// 栅格宽度选项
export const SPAN_OPTIONS = [
  { value: 6, label: '25% (6)' },
  { value: 12, label: '50% (12)' },
  { value: 18, label: '75% (18)' },
  { value: 24, label: '100% (24)' },
]

// 图表类型选项（从 mockData 导入）
export { chartTypeOptions }

// KPI 单位映射
export const KPI_UNIT_MAP: Record<string, string> = {
  sales: '元',
  orders: '单',
  users: '人',
  conversion: '%',
}

// LocalStorage 键名
export const STORAGE_KEYS = {
  CUSTOM_TEMPLATE: 'customTemplate',
  CUSTOM_TEMPLATES: 'customTemplates',
} as const

