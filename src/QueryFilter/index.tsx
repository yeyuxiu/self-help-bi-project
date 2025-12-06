import { useState } from 'react';
import { Form, DatePicker, Button, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { DataPoint } from '@/Data/mockData';
import styles from './index.less';

const { RangePicker } = DatePicker;

interface QueryFilterProps {
  data: DataPoint[];
  onFilterChange: (filteredData: DataPoint[]) => void;
}

const QueryFilter = ({ data, onFilterChange }: QueryFilterProps) => {
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  const handleQuery = () => {
    const values = form.getFieldsValue();
    let filtered = [...data];

    // 日期筛选
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.date);
        return (
          itemDate.isAfter(dateRange[0]!.subtract(1, 'day')) &&
          itemDate.isBefore(dateRange[1]!.add(1, 'day'))
        );
      });
    }

    onFilterChange(filtered);
  };

  const handleReset = () => {
    form.resetFields();
    setDateRange([null, null]);
    onFilterChange(data);
  };

  return (
    <div className={styles.queryFilter}>
      <Form form={form} layout="inline">
        <Form.Item label="日期范围" name="dateRange">
          <RangePicker
            value={dateRange as any}
            onChange={(dates) => {
              setDateRange(dates as [Dayjs | null, Dayjs | null]);
            }}
            format="YYYY-MM-DD"
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" onClick={handleQuery}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default QueryFilter;

