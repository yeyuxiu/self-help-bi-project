import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { DragOutlined } from '@ant-design/icons'
import styles from '../index.less'

interface DraggableComponentItemProps {
  id: string
  type: 'kpi' | 'chart'
  name: string
  icon?: any
  description?: string
}

const DraggableComponentItem = ({
  id,
  type,
  name,
  icon: Icon,
  description,
}: DraggableComponentItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { type, name },
    })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.componentItem}>
      <div {...listeners} {...attributes} className={styles.dragHandle}>
        <div className={styles.componentIcon}>{Icon && <Icon />}</div>
        <div className={styles.componentInfo}>
          <div className={styles.componentName}>{name}</div>
          {description && (
            <div className={styles.componentDesc}>{description}</div>
          )}
        </div>
        <DragOutlined className={styles.dragIcon} />
      </div>
    </div>
  )
}

export default DraggableComponentItem

