import { ChartConfig, ChartType, DataPoint } from '@/Data/mockData'

export interface ChartItem {
  id: string
  metricIds: string[]
  chartType: ChartType
  title: string
  config?: ChartConfig
}

export interface SortableItemProps {
  item: ChartItem
  data: DataPoint[]
  onDelete: (id: string) => void
  onEdit: (item: ChartItem) => void
  onConfigChange: (id: string, config: ChartConfig) => void
  linkedData?: DataPoint[]
  onChartClick?: (params: any) => void
}

