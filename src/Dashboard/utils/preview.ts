import { DollarOutlined, BarChartOutlined } from '@ant-design/icons'
import { TemplateComponent } from '../type'
import { KPI_METRICS, CHART_TYPE_ICONS } from '../constants'
import { chartTypeOptions } from '../constants'

/**
 * 获取拖拽预览组件
 */
export const getActiveComponentPreview = (
  activeId: string | null,
  components: TemplateComponent[]
) => {
  if (!activeId) return null

  if (typeof activeId === 'string') {
    // 从组件库拖拽
    if (activeId.startsWith('kpi-lib-')) {
      const metricId = activeId.replace('kpi-lib-', '')
      const metric = KPI_METRICS.find((m) => m.id === metricId)
      const Icon = metric?.icon || DollarOutlined
      return {
        icon: Icon,
        text: metric?.name || 'KPI 指标',
      }
    } else if (chartTypeOptions.find((opt: any) => opt.value === activeId)) {
      const option = chartTypeOptions.find((opt: any) => opt.value === activeId)
      const Icon = CHART_TYPE_ICONS[activeId] || BarChartOutlined
      return {
        icon: Icon,
        text: option?.label || '图表',
      }
    }
  }

  // 画布内组件拖拽
  const component = components.find((c) => c.id === activeId)
  if (component) {
    if (component.type === 'kpi') {
      const metric = KPI_METRICS.find((m) => m.id === component.metricId)
      const Icon = metric?.icon || DollarOutlined
      return {
        icon: Icon,
        text: component.title,
      }
    } else if (component.type === 'chart') {
      const Icon = CHART_TYPE_ICONS[component.chartType] || BarChartOutlined
      return {
        icon: Icon,
        text: component.title,
      }
    }
  }

  return null
}

