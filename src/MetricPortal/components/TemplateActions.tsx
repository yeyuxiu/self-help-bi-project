import { Button, Space, Tag, Tooltip, Divider } from 'antd'
import { FireOutlined, BgColorsOutlined } from '@ant-design/icons'
import { ChartConfig, ChartType, Metric } from '@/Data/mockData'
import { CHART_TEMPLATES, COLOR_PRESETS, pickRecommendedChart } from '../constants/templates'

interface TemplateActionsProps {
  metrics: Metric[]
  selectedMetrics: string[]
  onApply: (type?: ChartType, config?: ChartConfig) => void
}

const TemplateActions = ({ metrics, selectedMetrics, onApply }: TemplateActionsProps) => {
  const recommended = pickRecommendedChart(metrics, selectedMetrics)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space size="small" align="center">
        <Tag color="blue" style={{ padding: '2px 6px', borderRadius: 4 }}>
          推荐
        </Tag>
        <Tooltip title="基于指标类型智能推荐图表">
          <Button
            icon={<FireOutlined />}
            size="small"
            type="primary"
            ghost
          onClick={() => onApply(recommended, { showLegend: true })}
            disabled={selectedMetrics.length === 0}
          >
            一键推荐
          </Button>
        </Tooltip>
        <span style={{ color: '#8c8c8c', fontSize: 12 }}>选择指标后自动匹配适合的图表样式</span>
      </Space>

      <Divider style={{ margin: '8px 0' }} />

      <Space wrap size="small">
        {CHART_TEMPLATES.map((tpl) => (
          <Tooltip key={tpl.key} title={tpl.description}>
            <Button
              size="small"
              onClick={() => onApply(tpl.chartType, tpl.config)}
              icon={<FireOutlined />}
              ghost
            >
              {tpl.label}
            </Button>
          </Tooltip>
        ))}
      </Space>

      <Space wrap size="small">
        {COLOR_PRESETS.map((preset) => (
          <Button
            key={preset.key}
            size="small"
            icon={<BgColorsOutlined />}
            onClick={() => onApply(undefined, { colors: preset.colors })}
          >
            {preset.name}
          </Button>
        ))}
      </Space>
    </div>
  )
}

export default TemplateActions

