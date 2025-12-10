import { useState } from 'react'
import { Card, Form, Select, Button, Space } from 'antd'
import { BarChartOutlined } from '@ant-design/icons'
import { dimensions } from '@/Data/mockData'
import { groupByData, aggregateByTime } from '@/Utils/dataAggregation'
import type { AggregateKind, DataAggregationProps } from './types'
import { AGG_FUNC_OPTIONS, AGGREGATE_TYPE_OPTIONS, METRIC_OPTIONS } from './constants'

const DataAggregation = ({ data, onAggregated }: DataAggregationProps) => {
  const [form] = Form.useForm()
  const [aggregateType, setAggregateType] = useState<AggregateKind>('dimension')

  const handleAggregate = () => {
    const values = form.getFieldsValue()

    if (aggregateType === 'dimension') {
      if (!values.dimension || !values.metric || !values.aggFunc) {
        return
      }
      const aggregated = groupByData(data, {
        dimension: values.dimension,
        aggregate: [
          {
            metric: values.metric,
            func: values.aggFunc,
          },
        ],
      })
      onAggregated(aggregated)
    } else {
      if (!values.metric || !values.timePeriod || !values.timeAggFunc) {
        return
      }
      const aggregated = aggregateByTime(
        data,
        values.timePeriod,
        values.metric,
        values.timeAggFunc
      )
      onAggregated(aggregated)
    }
  }

  const handleReset = () => {
    form.resetFields()
    onAggregated(data)
  }

  return (
    <Card
      title={
        <Space>
          <BarChartOutlined />
          数据聚合
        </Space>
      }
      extra={
        <Space>
          <Button onClick={handleReset}>重置</Button>
          <Button type="primary" onClick={handleAggregate}>
            应用聚合
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="inline">
        <Form.Item label="聚合方式">
          <Select value={aggregateType} onChange={setAggregateType} style={{ width: 150 }} options={AGGREGATE_TYPE_OPTIONS} />
        </Form.Item>

        {aggregateType === 'dimension' && (
          <>
            <Form.Item label="分组维度" name="dimension">
              <Select
                style={{ width: 150 }}
                placeholder="选择维度"
                options={dimensions.map((d) => ({
                  label: d.name,
                  value: d.code,
                }))}
              />
            </Form.Item>
            <Form.Item label="聚合指标" name="metric">
              <Select style={{ width: 150 }} placeholder="选择指标" options={METRIC_OPTIONS} />
            </Form.Item>
            <Form.Item label="聚合函数" name="aggFunc">
              <Select style={{ width: 120 }} placeholder="选择函数" options={AGG_FUNC_OPTIONS} />
            </Form.Item>
          </>
        )}

        {aggregateType === 'time' && (
          <>
            <Form.Item label="聚合指标" name="metric">
              <Select style={{ width: 150 }} placeholder="选择指标" options={METRIC_OPTIONS} />
            </Form.Item>
            <Form.Item label="时间周期" name="timePeriod">
              <Select
                style={{ width: 120 }}
                placeholder="选择周期"
                options={[
                  { label: '按天', value: 'day' },
                  { label: '按周', value: 'week' },
                  { label: '按月', value: 'month' },
                ]}
              />
            </Form.Item>
            <Form.Item label="聚合函数" name="timeAggFunc">
              <Select style={{ width: 120 }} placeholder="选择函数" options={AGG_FUNC_OPTIONS} />
            </Form.Item>
          </>
        )}
      </Form>
    </Card>
  )
}

export default DataAggregation

