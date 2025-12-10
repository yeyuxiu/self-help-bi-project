import { ChartType, ChartConfig } from '@/Data/mockData'

export type ComponentType = 'kpi' | 'chart'

export interface KpiComponent {
  id: string
  type: 'kpi'
  metricId: string
  title: string
  span: number
  x: number
  y: number
}

export interface ChartComponent {
  id: string
  type: 'chart'
  chartType: ChartType
  title: string
  metricIds: string[]
  config?: ChartConfig
  span: number
  x: number
  y: number
}

export type TemplateComponent = KpiComponent | ChartComponent

export interface Template {
  id: string
  name: string
  components: TemplateComponent[]
  createdAt: string
  updatedAt: string
}

