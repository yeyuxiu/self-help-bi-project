import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Card, Statistic, Button, Space } from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import ChartView from '@/ChartView'
import ChartConfigPanel from '@/Components/ChartConfigPanel'
import { metrics, mockData } from '@/Data/mockData'
import { TemplateComponent, KpiComponent, ChartComponent } from '../type'
import { KPI_METRICS, KPI_UNIT_MAP } from '../constants'
import styles from '../index.less'

interface CanvasComponentProps {
  component: TemplateComponent
  kpiData?: any
  onDelete: (id: string) => void
  onEdit: (component: TemplateComponent) => void
  onConfigChange: (id: string, config: any) => void
}

const CanvasComponent = ({
  component,
  kpiData,
  onDelete,
  onEdit,
  onConfigChange,
}: CanvasComponentProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: component.id,
      data: component,
    })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  // KPI 组件渲染
  if (component.type === 'kpi') {
    const kpiComponent = component as KpiComponent
    const kpiMetric = KPI_METRICS.find((m) => m.id === kpiComponent.metricId)
    const Icon = kpiMetric?.icon
    const kpiValue =
      kpiData?.[
        `total${
          kpiComponent.metricId.charAt(0).toUpperCase() +
          kpiComponent.metricId.slice(1)
        }`
      ] || 0
    const trend = kpiData?.[`${kpiComponent.metricId}Trend`] || 'up'
    const change = kpiData?.[`${kpiComponent.metricId}Change`] || 0
    const unit = KPI_UNIT_MAP[kpiComponent.metricId] || ''

    return (
      <div ref={setNodeRef} style={style} className={styles.canvasComponent}>
        <Card
          className={styles.componentCard}
          title={
            <div className={styles.cardHeader}>
              <span
                {...attributes}
                {...listeners}
                className={styles.dragHandle}
              >
                <EditOutlined />
              </span>
              <span>{kpiComponent.title}</span>
              <Space>
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(component)}
                />
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(component.id)}
                />
              </Space>
            </div>
          }
        >
          <Statistic
            title={
              <div className={styles.statTitle}>
                {Icon && <Icon className={styles.icon} />}
                <span>{kpiMetric?.name}</span>
              </div>
            }
            value={kpiValue}
            precision={kpiComponent.metricId === 'conversion' ? 2 : 0}
            valueStyle={{
              color: trend === 'up' ? '#3f8600' : '#cf1322',
            }}
            prefix={
              trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />
            }
            suffix={unit}
          />
          {change !== undefined && (
            <div className={styles.change}>
              较昨日: {change > 0 ? '+' : ''}
              {change.toLocaleString()} {unit}
            </div>
          )}
        </Card>
      </div>
    )
  }

  // 图表组件渲染
  if (component.type === 'chart') {
    const chartComponent = component as ChartComponent
    const selectedMetrics = metrics.filter((m: any) =>
      chartComponent.metricIds.includes(m.id)
    )

    return (
      <div ref={setNodeRef} style={style} className={styles.canvasComponent}>
        <Card
          className={styles.componentCard}
          title={
            <div className={styles.cardHeader}>
              <span
                {...attributes}
                {...listeners}
                className={styles.dragHandle}
              >
                <EditOutlined />
              </span>
              <span>{chartComponent.title}</span>
              <Space>
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(component)}
                />
                <ChartConfigPanel
                  chartType={chartComponent.chartType}
                  config={chartComponent.config || {}}
                  onConfigChange={(config) =>
                    onConfigChange(chartComponent.id, config)
                  }
                  trigger={
                    <Button type="text" size="small" icon={<EditOutlined />}>
                      配置
                    </Button>
                  }
                />
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(component.id)}
                />
              </Space>
            </div>
          }
        >
          <ChartView
            data={mockData}
            metrics={selectedMetrics}
            viewMode="chart"
            chartType={chartComponent.chartType}
            config={chartComponent.config}
          />
        </Card>
      </div>
    )
  }

  return null
}

export default CanvasComponent

