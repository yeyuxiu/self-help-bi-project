import { Dayjs } from 'dayjs'
import { ChartConfig, ChartType, AggregateType } from '@/Data/mockData'

export type AggregateKind = 'dimension' | 'time'

export interface FilterCondition {
  field: string
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not in' | 'contains'
  value: string | number | string[] | [Dayjs | null, Dayjs | null]
}

export interface AggregationFormValues {
  dimension?: string
  metric?: string
  aggFunc?: AggregateType
  timePeriod?: 'day' | 'week' | 'month'
  timeAggFunc?: AggregateType
}

export interface MetricPortalState {
  selectedMetrics: string[]
  filters: Record<string, any>
  aggregation: any
  viewMode: 'table' | 'chart'
  chartType: ChartType
  chartConfig: ChartConfig
  dateRange: [Dayjs | null, Dayjs | null]
  conditions: FilterCondition[]
  aggregateType: AggregateKind
}

export interface SavedView {
  id: string
  name: string
  metrics: string[]
  chartType: ChartType
  chartConfig?: ChartConfig
  createdAt: number
}

export interface InsightSummary {
  rowCount: number
  dateRange?: { start: string; end: string }
  metricStat?: {
    metricId: string
    sum: number
    avg: number
    max: number
    min: number
  }
  dimensionCoverage: { dimension: string; count: number }[]
}

