import { useState } from 'react';
import { Card, Form, Select, DatePicker, InputNumber, Button, Space, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FormListFieldData } from 'antd';
import { DataPoint, dimensions } from '@/Data/mockData';
import dayjs, { Dayjs } from 'dayjs';
import styles from './index.less';

const { RangePicker } = DatePicker;

interface FilterCondition {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not in' | 'contains';
  value: string | number | string[] | [Dayjs | null, Dayjs | null];
}

interface AdvancedFilterProps {
  data: DataPoint[];
  onFilterChange: (filteredData: DataPoint[]) => void;
}

const AdvancedFilter = ({ data, onFilterChange }: AdvancedFilterProps) => {
  const [form] = Form.useForm();
  const [conditions, setConditions] = useState<FilterCondition[]>([]);

  const handleAddCondition = () => {
    setConditions([
      ...conditions,
      { field: 'date', operator: '=', value: '' },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleConditionChange = (index: number, field: string, value: any) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
  };

  const handleQuery = () => {
    let filtered = [...data];

    conditions.forEach((condition) => {
      if (!condition.field || condition.value === '' || condition.value === null) {
        return;
      }

      filtered = filtered.filter((item) => {
        const itemValue = item[condition.field];
        
        switch (condition.operator) {
          case '=':
            return itemValue === condition.value;
          case '!=':
            return itemValue !== condition.value;
          case '>':
            return (itemValue as number) > (condition.value as number);
          case '<':
            return (itemValue as number) < (condition.value as number);
          case '>=':
            return (itemValue as number) >= (condition.value as number);
          case '<=':
            return (itemValue as number) <= (condition.value as number);
          case 'in':
            return (condition.value as string[]).includes(itemValue as string);
          case 'not in':
            return !(condition.value as string[]).includes(itemValue as string);
          case 'contains':
            return String(itemValue).includes(String(condition.value));
          default:
            return true;
        }
      });
    });

    onFilterChange(filtered);
  };

  const handleReset = () => {
    setConditions([]);
    form.resetFields();
    onFilterChange(data);
  };

  const getFieldOptions = () => {
    const metricFields = ['sales', 'orders', 'users', 'conversion', 'avg_price', 'visits'];
    const dimensionFields = dimensions.map((d) => ({ label: d.name, value: d.code }));
    return [
      { label: '日期', value: 'date' },
      ...dimensionFields,
      ...metricFields.map((f) => ({ label: f, value: f })),
    ];
  };

  const getOperatorOptions = (field: string) => {
    const isNumeric = ['sales', 'orders', 'users', 'avg_price', 'visits', 'conversion'].includes(field);
    const isDate = field === 'date';
    
    if (isDate) {
      return [
        { label: '等于', value: '=' },
        { label: '范围', value: 'in' },
      ];
    }
    
    if (isNumeric) {
      return [
        { label: '等于', value: '=' },
        { label: '不等于', value: '!=' },
        { label: '大于', value: '>' },
        { label: '小于', value: '<' },
        { label: '大于等于', value: '>=' },
        { label: '小于等于', value: '<=' },
      ];
    }
    
    return [
      { label: '等于', value: '=' },
      { label: '不等于', value: '!=' },
      { label: '包含', value: 'contains' },
      { label: '属于', value: 'in' },
      { label: '不属于', value: 'not in' },
    ];
  };

  return (
    <div className={styles.advancedFilter}>
      <Card
        title="高级筛选"
        extra={
          <Space>
            <Button icon={<PlusOutlined />} onClick={handleAddCondition}>
              添加条件
            </Button>
            <Button onClick={handleQuery} type="primary">
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {conditions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              点击"添加条件"开始筛选
            </div>
          )}
          
          {conditions.map((condition, index) => (
            <Card key={index} size="small" className={styles.conditionCard}>
              <Space align="start" style={{ width: '100%' }}>
                <Form.Item label="字段" style={{ margin: 0 }}>
                  <Select
                    style={{ width: 150 }}
                    value={condition.field}
                    onChange={(value) => handleConditionChange(index, 'field', value)}
                    options={getFieldOptions()}
                  />
                </Form.Item>

                <Form.Item label="操作符" style={{ margin: 0 }}>
                  <Select
                    style={{ width: 120 }}
                    value={condition.operator}
                    onChange={(value) => handleConditionChange(index, 'operator', value)}
                    options={getOperatorOptions(condition.field)}
                  />
                </Form.Item>

                <Form.Item label="值" style={{ margin: 0, flex: 1 }}>
                  {condition.field === 'date' && condition.operator === 'in' ? (
                    <RangePicker
                      value={condition.value as [Dayjs | null, Dayjs | null]}
                      onChange={(dates) => handleConditionChange(index, 'value', dates)}
                    />
                  ) : ['>', '<', '>=', '<='].includes(condition.operator) ? (
                    <InputNumber
                      style={{ width: '100%' }}
                      value={condition.value as number}
                      onChange={(value) => handleConditionChange(index, 'value', value)}
                    />
                  ) : condition.operator === 'in' || condition.operator === 'not in' ? (
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      value={condition.value as string[]}
                      onChange={(value) => handleConditionChange(index, 'value', value)}
                      options={
                        dimensions.find((d) => d.code === condition.field)?.values?.map((v) => ({
                          label: v,
                          value: v,
                        })) || []
                      }
                    />
                  ) : (
                    <Select
                      style={{ width: '100%' }}
                      value={condition.value as string}
                      onChange={(value) => handleConditionChange(index, 'value', value)}
                      options={
                        dimensions.find((d) => d.code === condition.field)?.values?.map((v) => ({
                          label: v,
                          value: v,
                        })) || []
                      }
                    />
                  )}
                </Form.Item>

                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveCondition(index)}
                />
              </Space>
            </Card>
          ))}
        </Space>
      </Card>
    </div>
  );
};

export default AdvancedFilter;

