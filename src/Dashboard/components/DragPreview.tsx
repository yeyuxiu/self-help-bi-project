import { IconType } from '@ant-design/icons'
import styles from '../index.less'

interface DragPreviewProps {
  icon: IconType
  text: string
}

const DragPreview = ({ icon: Icon, text }: DragPreviewProps) => {
  return (
    <div className={styles.dragPreview}>
      <Icon className={styles.dragPreviewIcon} />
      <span>{text}</span>
    </div>
  )
}

export default DragPreview

