import { Card, Form, Select, Button, Space } from 'antd'
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons'
import { ChartType } from '@/Data/mockData'
import { metrics, chartTypeOptions } from '@/Data/mockData'
import styles from '../index.less'

interface ConfigCardProps {
  selectedMetrics: string[]
  chartType: ChartType
  onMetricChange: (value: string[]) => void
  onChartTypeChange: (value: ChartType) => void
  onReset: () => void
  onSave: () => void
}

const ConfigCard = ({
  selectedMetrics,
  chartType,
  onMetricChange,
  onChartTypeChange,
  onReset,
  onSave,
}: ConfigCardProps) => {
  return (
    <Card size="small" className={styles.configCard}>
      <Form layout="inline" className={styles.compactForm}>
        <Form.Item label="指标" style={{ marginBottom: 0 }}>
          <Select
            mode="multiple"
            style={{ width: 280 }}
            placeholder="选择指标"
            value={selectedMetrics}
            onChange={onMetricChange}
            options={metrics.map((m) => ({
              label: `${m.name} (${m.unit || ''})`,
              value: m.id,
            }))}
          />
        </Form.Item>
        <Form.Item label="图表类型" style={{ marginBottom: 0 }}>
          <Select
            style={{ width: 150 }}
            value={chartType}
            onChange={onChartTypeChange}
            options={chartTypeOptions}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, marginLeft: 'auto' }}>
          <Space>
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={onReset}
              title="重置"
            />
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={onSave}
              size="small"
            >
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default ConfigCard

