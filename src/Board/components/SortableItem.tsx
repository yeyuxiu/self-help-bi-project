import { Card, Space, Button } from 'antd'
import { MenuOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import ChartView from '@/ChartView'
import ChartConfigPanel from '@/Components/ChartConfigPanel'
import { metrics, DataPoint, ChartConfig } from '@/Data/mockData'
import { ChartItem } from '../types'
import styles from '../index.less'

interface SortableItemProps {
  item: ChartItem
  data: DataPoint[]
  onDelete: (id: string) => void
  onEdit: (item: ChartItem) => void
  onConfigChange: (id: string, config: ChartConfig) => void
  linkedData?: DataPoint[]
  onChartClick?: (params: any) => void
}

const SortableItem = ({
  item,
  data,
  onDelete,
  onEdit,
  onConfigChange,
  linkedData,
  onChartClick,
}: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const displayData = linkedData || data

  return (
    <div ref={setNodeRef} style={style} className={styles.sortableItem}>
      <Card
        title={
          <div className={styles.cardHeader}>
            <span {...attributes} {...listeners} className={styles.dragHandle}>
              <MenuOutlined />
            </span>
            <span>{item.title}</span>
            <Space>
              <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(item)} />
              <ChartConfigPanel
                chartType={item.chartType}
                config={item.config || {}}
                onConfigChange={(config: ChartConfig) => onConfigChange(item.id, config)}
                trigger={
                  <Button type="text" size="small" icon={<EditOutlined />}>
                    配置
                  </Button>
                }
              />
              <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => onDelete(item.id)} />
            </Space>
          </div>
        }
        className={styles.chartCard}
      >
        <ChartView
          data={displayData}
          metrics={metrics.filter((m: { id: string }) => item.metricIds.includes(m.id))}
          viewMode="chart"
          chartType={item.chartType}
          config={item.config}
          onChartClick={onChartClick}
        />
      </Card>
    </div>
  )
}

export default SortableItem

