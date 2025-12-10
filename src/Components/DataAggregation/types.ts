import type { DataPoint } from '@/Data/mockData'

export type AggregateKind = 'dimension' | 'time'

export interface DataAggregationProps {
  data: DataPoint[]
  onAggregated: (data: DataPoint[]) => void
}

