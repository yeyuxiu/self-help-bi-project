import { Row, Col, Badge, Empty } from 'antd'
import { useDroppable } from '@dnd-kit/core'
import CanvasComponent from './CanvasComponent'
import { TemplateComponent } from '../type'
import styles from '../index.less'

interface CanvasAreaProps {
  components: TemplateComponent[]
  kpiData?: any
  onDelete: (id: string) => void
  onEdit: (component: TemplateComponent) => void
  onConfigChange: (id: string, config: any) => void
}

const CanvasArea = ({
  components,
  kpiData,
  onDelete,
  onEdit,
  onConfigChange,
}: CanvasAreaProps) => {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  })

  return (
    <div className={styles.canvasArea}>
      <div className={styles.canvasHeader}>
        <span>画布区域</span>
        <Badge count={components.length} showZero>
          <span className={styles.componentCount}>
            已添加 {components.length} 个组件
          </span>
        </Badge>
      </div>
      <div ref={setNodeRef} className={styles.canvas}>
        {components.length === 0 ? (
          <div className={styles.emptyCanvas}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <p className={styles.emptyTitle}>
                    开始创建您的自定义模板
                  </p>
                  <p className={styles.emptyDesc}>
                    从左侧组件库拖拽 KPI 指标或图表类型到此处
                  </p>
                </div>
              }
            />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {components.map((component) => (
              <Col key={component.id} xs={24} sm={12} lg={component.span}>
                <CanvasComponent
                  component={component}
                  kpiData={kpiData?.data}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onConfigChange={onConfigChange}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  )
}

export default CanvasArea

