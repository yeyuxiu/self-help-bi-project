import { Dayjs } from 'dayjs'
import { ChartType, ChartConfig, AggregateType } from '@/Data/mockData'

export interface FilterCondition {
  field: string
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not in' | 'contains'
  value: string | number | string[] | [Dayjs | null, Dayjs | null]
}

export interface ReportTemplateState {
  selectedMetrics: string[]
  filteredData: any[]
  chartType: ChartType
  chartConfig: ChartConfig
  dateRange: [Dayjs | null, Dayjs | null]
  conditions: FilterCondition[]
  aggregateType: 'dimension' | 'time'
}

export interface ReportTemplateFormValues {
  dimension?: string
  metric?: string
  aggFunc?: AggregateType
  timePeriod?: 'day' | 'week' | 'month'
  timeAggFunc?: AggregateType
}

