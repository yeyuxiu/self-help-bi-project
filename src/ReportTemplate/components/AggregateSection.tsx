import { Form, Select, Button, Space } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'
import { AggregateType } from '@/Data/mockData'
import {
  AGG_FUNC_OPTIONS,
  METRIC_OPTIONS,
  TIME_PERIOD_OPTIONS,
  AGGREGATE_TYPE_OPTIONS,
} from '../constants'
import { dimensions } from '@/Data/mockData'
import styles from '../index.less'

interface AggregateSectionProps {
  aggregateType: 'dimension' | 'time'
  onAggregateTypeChange: (type: 'dimension' | 'time') => void
  onAggregate: () => void
}

const AggregateSection = ({
  aggregateType,
  onAggregateTypeChange,
  onAggregate,
}: AggregateSectionProps) => {
  return (
    <Form.Item
      label={
        <>
          <BarChartOutlined /> 聚合
        </>
      }
      style={{ marginBottom: 0 }}
    >
      <Space size="small" wrap>
        <Select
          size="small"
          value={aggregateType}
          onChange={onAggregateTypeChange}
          style={{ width: 80 }}
          options={AGGREGATE_TYPE_OPTIONS}
        />
        {aggregateType === 'dimension' ? (
          <>
            <Form.Item name="dimension" style={{ margin: 0 }}>
              <Select
                size="small"
                style={{ width: 100 }}
                placeholder="维度"
                options={dimensions.map((d) => ({
                  label: d.name,
                  value: d.code,
                }))}
              />
            </Form.Item>
            <Form.Item name="metric" style={{ margin: 0 }}>
              <Select
                size="small"
                style={{ width: 100 }}
                placeholder="指标"
                options={METRIC_OPTIONS}
              />
            </Form.Item>
            <Form.Item name="aggFunc" style={{ margin: 0 }}>
              <Select
                size="small"
                style={{ width: 80 }}
                placeholder="函数"
                options={AGG_FUNC_OPTIONS}
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item name="metric" style={{ margin: 0 }}>
              <Select
                size="small"
                style={{ width: 100 }}
                placeholder="指标"
                options={METRIC_OPTIONS}
              />
            </Form.Item>
            <Form.Item name="timePeriod" style={{ margin: 0 }}>
              <Select
                size="small"
                style={{ width: 80 }}
                placeholder="周期"
                options={TIME_PERIOD_OPTIONS}
              />
            </Form.Item>
            <Form.Item name="timeAggFunc" style={{ margin: 0 }}>
              <Select
                size="small"
                style={{ width: 80 }}
                placeholder="函数"
                options={AGG_FUNC_OPTIONS}
              />
            </Form.Item>
          </>
        )}
        <Button
          type="primary"
          icon={<BarChartOutlined />}
          size="small"
          onClick={onAggregate}
          title="应用聚合"
        />
      </Space>
    </Form.Item>
  )
}

export default AggregateSection

