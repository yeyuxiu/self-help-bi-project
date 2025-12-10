import { Card, Button, Space, message } from 'antd'
import { DownloadOutlined, SettingOutlined } from '@ant-design/icons'
import ChartView from '@/ChartView'
import ChartConfigPanel from '@/Components/ChartConfigPanel'
import { metrics, DataPoint, ChartType, ChartConfig, Metric } from '@/Data/mockData'
import { exportToCSV } from '@/Utils/export'

interface PreviewCardProps {
  selectedMetrics: string[]
  filteredData: DataPoint[]
  chartType: ChartType
  chartConfig: ChartConfig
  onConfigChange: (config: ChartConfig) => void
}

const PreviewCard = ({
  selectedMetrics,
  filteredData,
  chartType,
  chartConfig,
  onConfigChange,
}: PreviewCardProps) => {
  const handleExport = () => {
    const selectedMetricList = metrics.filter((m) => selectedMetrics.includes(m.id))
    if (selectedMetricList.length === 0) {
      message.warning('请先选择指标')
      return
    }
    exportToCSV(filteredData, selectedMetricList, '报表数据')
  }

  return (
    <Card
      title="报表预览"
      size="small"
      extra={
        <Space>
          <ChartConfigPanel
            chartType={chartType}
            config={chartConfig}
            onConfigChange={onConfigChange}
            trigger={
              <Button
                type="text"
                size="small"
                icon={<SettingOutlined />}
                title="图表配置"
              />
            }
          />
          <Button
            type="text"
            icon={<DownloadOutlined />}
            size="small"
            onClick={handleExport}
            disabled={selectedMetrics.length === 0}
            title="导出数据"
          />
        </Space>
      }
    >
      <ChartView
        data={filteredData}
        metrics={metrics.filter((m: Metric) => selectedMetrics.includes(m.id))}
        viewMode="chart"
        chartType={chartType}
        config={chartConfig}
      />
    </Card>
  )
}

export default PreviewCard

