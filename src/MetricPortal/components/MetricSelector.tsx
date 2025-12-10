import { Form, Checkbox, Space, Button } from 'antd'
import { ReloadOutlined, AppstoreOutlined } from '@ant-design/icons'
import styles from '../index.less'

interface MetricSelectorProps {
  metrics: any[]
  selected: string[]
  onChange: (ids: string[]) => void
  onReset: () => void
}

const MetricSelector = ({ metrics, selected, onChange, onReset }: MetricSelectorProps) => {
  return (
    <>
      <Form.Item
        label={
          <>
            <AppstoreOutlined /> 指标
          </>
        }
        style={{ marginBottom: 0 }}
      >
        <Checkbox.Group
          value={selected}
          onChange={(checkedValues) => onChange(checkedValues as string[])}
          style={{ width: '100%' }}
        >
          <Space wrap size="small">
            {metrics.map((metric: any) => (
              <Checkbox key={metric.id} value={metric.id}>
                {metric.name} ({metric.unit || ''})
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Form.Item>
      <Form.Item style={{ marginBottom: 0, marginLeft: 'auto' }}>
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={onReset}
          title="重置"
          size="small"
          className={styles.resetBtn}
        />
      </Form.Item>
    </>
  )
}

export default MetricSelector

