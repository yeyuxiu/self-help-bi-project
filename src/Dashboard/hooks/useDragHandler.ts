import { useState } from 'react'
import { message } from 'antd'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { TemplateComponent, KpiComponent, ChartComponent } from '../type'
import { KPI_METRICS, chartTypeOptions } from '../constants'
import { ChartType } from '@/Data/mockData'

interface UseDragHandlerProps {
  components: TemplateComponent[]
  setComponents: React.Dispatch<React.SetStateAction<TemplateComponent[]>>
}

export const useDragHandler = ({
  components,
  setComponents,
}: UseDragHandlerProps) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeData = active.data.current
    if (!activeData) return

    const isOverCanvas = over.id === 'canvas'
    const isOverCanvasComponent = components.some((c) => c.id === over.id)

    // 从组件库拖拽到画布
    if (activeData.type === 'kpi' || activeData.type === 'chart') {
      if (!isOverCanvas && !isOverCanvasComponent) return

      if (activeData.type === 'kpi') {
        const metricId = String(active.id).replace('kpi-lib-', '')
        const metric = KPI_METRICS.find((m) => m.id === metricId)

        if (!metric) {
          message.error('未找到对应的指标')
          return
        }

        const newComponent: KpiComponent = {
          id: `kpi-${Date.now()}`,
          type: 'kpi',
          metricId: metric.id,
          title: metric.name,
          span: 6,
          x: 0,
          y: components.length,
        }
        setComponents([...components, newComponent])
        message.success(`已添加 KPI 指标: ${metric.name}`)
      } else if (activeData.type === 'chart') {
        const chartType = String(active.id) as ChartType
        const chartOption = chartTypeOptions.find(
          (opt: any) => opt.value === chartType
        )

        if (!chartOption) {
          message.error('未找到对应的图表类型')
          return
        }

        const newComponent: ChartComponent = {
          id: `chart-${Date.now()}`,
          type: 'chart',
          chartType,
          title: chartOption.label || '图表',
          metricIds: ['1'],
          span: 12,
          x: 0,
          y: components.length,
        }
        setComponents([...components, newComponent])
        message.success(`已添加图表: ${chartOption.label}`)
      }
    } else {
      // 画布内组件重新排序
      const draggedComponent = components.find((c) => c.id === active.id)
      if (draggedComponent && isOverCanvasComponent) {
        const oldIndex = components.findIndex((c) => c.id === active.id)
        const newIndex = components.findIndex((c) => c.id === over.id)
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const newComponents = [...components]
          const [removed] = newComponents.splice(oldIndex, 1)
          newComponents.splice(newIndex, 0, removed)
          setComponents(newComponents)
          message.success('组件位置已更新')
        }
      }
    }
  }

  return {
    activeId,
    handleDragStart,
    handleDragEnd,
  }
}

