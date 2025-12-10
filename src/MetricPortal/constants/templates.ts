import { ChartConfig, ChartType, Metric } from '@/Data/mockData'

export interface ChartTemplate {
  key: string
  label: string
  chartType: ChartType
  description?: string
  config?: ChartConfig
}

export const CHART_TEMPLATES: ChartTemplate[] = [
  {
    key: 'smooth-line',
    label: '平滑趋势',
    chartType: 'line',
    description: '时间序列趋势 + 平滑曲线',
    config: { smooth: true, showLegend: true },
  },
  {
    key: 'stack-area',
    label: '堆叠面积',
    chartType: 'area',
    description: '对比多指标占比与趋势',
    config: { stack: true, smooth: true, showLegend: true },
  },
  {
    key: 'compare-bar',
    label: '对比柱状',
    chartType: 'bar',
    description: '类目对比与排序展示',
    config: { showLegend: true },
  },
  {
    key: 'focus-pie',
    label: '占比饼图',
    chartType: 'pie',
    description: '强调占比结构，默认 60% 半径',
    config: { radius: '60%', showLegend: true },
  },
  {
    key: 'radar-profile',
    label: '画像雷达',
    chartType: 'radar',
    description: '多指标画像评分展示',
    config: { showLegend: true },
  },
]

export const COLOR_PRESETS: { key: string; name: string; colors: string[] }[] = [
  {
    key: 'vibrant',
    name: '活力',
    colors: ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262fd', '#78D3F8'],
  },
  {
    key: 'soft',
    name: '柔和',
    colors: ['#6ec8c8', '#9fb7d3', '#f2c6de', '#f7d8ba', '#c6d8af', '#9ad5c0'],
  },
  {
    key: 'mono',
    name: '专业',
    colors: ['#4a6fa5', '#6b8fb4', '#8aa6c1', '#a8bccd', '#c7d2db', '#e1e8f0'],
  },
]

export const RECOMMENDED_CHART_BY_METRIC_TYPE: Record<string, ChartType> = {
  percent: 'gauge',
  currency: 'bar',
  number: 'line',
}

export const pickRecommendedChart = (metrics: Metric[], selected: string[]): ChartType => {
  const target = metrics.find((m) => m.id === selected[0])
  if (!target) {
    return 'line'
  }
  return RECOMMENDED_CHART_BY_METRIC_TYPE[target.type] || 'line'
}

