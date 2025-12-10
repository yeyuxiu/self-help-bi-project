import { Space, Select, Tabs, Button } from 'antd'
import { BarChartOutlined, TableOutlined, DownloadOutlined } from '@ant-design/icons'
import ChartConfigPanel from '@/Components/ChartConfigPanel'
import { exportToCSV } from '@/Utils/export'
import { ChartConfig, ChartType } from '@/Data/mockData'
import { CHART_TYPE_OPTIONS } from '../constants/options'

interface DataToolbarProps {
  chartType: ChartType
  onChartTypeChange: (type: ChartType) => void
  viewMode: 'table' | 'chart'
  onViewModeChange: (mode: 'table' | 'chart') => void
  chartConfig: ChartConfig
  onConfigChange: (config: ChartConfig) => void
  metrics: any[]
  selectedMetrics: string[]
  data: any[]
}

const tabItems = [
  {
    key: 'chart',
    label: (
      <span>
        <BarChartOutlined />
        图表视图
      </span>
    ),
  },
  {
    key: 'table',
    label: (
      <span>
        <TableOutlined />
        表格视图
      </span>
    ),
  },
]

const DataToolbar = ({
  chartType,
  onChartTypeChange,
  viewMode,
  onViewModeChange,
  chartConfig,
  onConfigChange,
  metrics,
  selectedMetrics,
  data,
}: DataToolbarProps) => {
  const handleExport = () => {
    const selectedMetricList = metrics.filter((m: { id: string }) => selectedMetrics.includes(m.id))
    if (selectedMetricList.length === 0) {
      return
    }
    exportToCSV(data, selectedMetricList, '指标数据')
  }

  return (
    <Space>
      <Select value={chartType} onChange={onChartTypeChange} style={{ width: 120 }} size="small" options={CHART_TYPE_OPTIONS} />
      <Tabs activeKey={viewMode} items={tabItems} onChange={(key) => onViewModeChange(key as 'table' | 'chart')} size="small" />
      {viewMode === 'chart' && (
        <ChartConfigPanel
          chartType={chartType}
          config={chartConfig}
          onConfigChange={onConfigChange}
          trigger={
            <Button type="text" size="small" icon={<BarChartOutlined />} title="图表配置" />
          }
        />
      )}
      <Button icon={<DownloadOutlined />} onClick={handleExport} disabled={selectedMetrics.length === 0} size="small" title="导出数据">
        导出
      </Button>
    </Space>
  )
}

export default DataToolbar

