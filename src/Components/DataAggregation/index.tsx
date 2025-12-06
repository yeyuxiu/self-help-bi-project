import { useState } from 'react';
import { Card, Form, Select, Button, Space } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { dimensions, AggregateType } from '@/Data/mockData';
import { groupByData, aggregateByTime } from '@/Utils/dataAggregation';
import type { DataPoint } from '@/Data/mockData';

interface DataAggregationProps {
  data: DataPoint[];
  onAggregated: (data: DataPoint[]) => void;
}

const DataAggregation = ({ data, onAggregated }: DataAggregationProps) => {
  const [form] = Form.useForm();
  const [aggregateType, setAggregateType] = useState<'dimension' | 'time'>('dimension');

  const handleAggregate = () => {
    const values = form.getFieldsValue();
    
    if (aggregateType === 'dimension') {
      if (!values.dimension || !values.metric || !values.aggFunc) {
        return;
      }
      const aggregated = groupByData(data, {
        dimension: values.dimension,
        aggregate: [
          {
            metric: values.metric,
            func: values.aggFunc,
          },
        ],
      });
      onAggregated(aggregated);
    } else {
      if (!values.metric || !values.timePeriod || !values.timeAggFunc) {
        return;
      }
      const aggregated = aggregateByTime(
        data,
        values.timePeriod,
        values.metric,
        values.timeAggFunc
      );
      onAggregated(aggregated);
    }
  };

  const handleReset = () => {
    form.resetFields();
    onAggregated(data);
  };

  const metricOptions = [
    { label: '销售额', value: 'sales' },
    { label: '订单数', value: 'orders' },
    { label: '用户数', value: 'users' },
    { label: '访问量', value: 'visits' },
    { label: '转化率', value: 'conversion' },
    { label: '客单价', value: 'avg_price' },
  ];

  const aggFuncOptions: { label: string; value: AggregateType }[] = [
    { label: '求和', value: 'sum' },
    { label: '平均值', value: 'avg' },
    { label: '最大值', value: 'max' },
    { label: '最小值', value: 'min' },
    { label: '计数', value: 'count' },
  ];

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
          <Select
            value={aggregateType}
            onChange={setAggregateType}
            style={{ width: 150 }}
            options={[
              { label: '按维度聚合', value: 'dimension' },
              { label: '按时间聚合', value: 'time' },
            ]}
          />
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
              <Select
                style={{ width: 150 }}
                placeholder="选择指标"
                options={metricOptions}
              />
            </Form.Item>
            <Form.Item label="聚合函数" name="aggFunc">
              <Select
                style={{ width: 120 }}
                placeholder="选择函数"
                options={aggFuncOptions}
              />
            </Form.Item>
          </>
        )}

        {aggregateType === 'time' && (
          <>
            <Form.Item label="聚合指标" name="metric">
              <Select
                style={{ width: 150 }}
                placeholder="选择指标"
                options={metricOptions}
              />
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
              <Select
                style={{ width: 120 }}
                placeholder="选择函数"
                options={aggFuncOptions}
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Card>
  );
};

export default DataAggregation;

