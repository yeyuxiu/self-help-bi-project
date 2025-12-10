import { Button, Space } from 'antd'
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { message } from 'antd'

interface DashboardHeaderProps {
  componentsCount: number
  onClear: () => void
  onSave: () => void
}

const DashboardHeader = ({
  componentsCount,
  onClear,
  onSave,
}: DashboardHeaderProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h2 style={{ margin: 0 }}>自定义模板</h2>
        <p style={{ margin: '4px 0 0 0', color: '#666' }}>
          拖拽组件到画布，自定义您的数据看板
        </p>
      </div>
      <Space>
        <Button
          icon={<ReloadOutlined />}
          onClick={onClear}
          disabled={componentsCount === 0}
        >
          清空
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={onSave}
          disabled={componentsCount === 0}
        >
          保存模板
        </Button>
      </Space>
    </div>
  )
}

export default DashboardHeader

