import { Form, Select, Space, Button } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'
import {
  AGG_FUNC_OPTIONS,
  METRIC_OPTIONS,
  TIME_PERIOD_OPTIONS,
  AGGREGATE_TYPE_OPTIONS,
} from '../constants/options'
import { dimensions } from '@/Data/mockData'
import { AggregateKind } from '../types'
import styles from '../index.less'

interface AggregationSectionProps {
  aggregateType: AggregateKind
  onTypeChange: (type: AggregateKind) => void
  onAggregate: () => void
}

const AggregationSection = ({
  aggregateType,
  onTypeChange,
  onAggregate,
}: AggregationSectionProps) => {
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
          onChange={onTypeChange}
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
          className={styles.applyBtn}
        />
      </Space>
    </Form.Item>
  )
}

export default AggregationSection

