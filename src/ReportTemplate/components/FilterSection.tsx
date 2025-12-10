import { Form, DatePicker, Select, Button, Space, Popover } from 'antd'
import {
  CalendarOutlined,
  FilterOutlined,
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Dayjs } from 'dayjs'
import { FilterCondition } from '../type'
import { getFieldOptions, getOperatorOptions } from '../constants'
import { dimensions } from '@/Data/mockData'
import { InputNumber } from 'antd'
import styles from '../index.less'

const { RangePicker } = DatePicker

interface FilterSectionProps {
  dateRange: [Dayjs | null, Dayjs | null]
  conditions: FilterCondition[]
  onDateRangeChange: (dates: [Dayjs | null, Dayjs | null]) => void
  onDateFilter: () => void
  onAddCondition: () => void
  onRemoveCondition: (index: number) => void
  onConditionChange: (index: number, field: string, value: any) => void
  onAdvancedFilter: () => void
}

const FilterSection = ({
  dateRange,
  conditions,
  onDateRangeChange,
  onDateFilter,
  onAddCondition,
  onRemoveCondition,
  onConditionChange,
  onAdvancedFilter,
}: FilterSectionProps) => {
  return (
    <Form layout="inline" className={styles.compactFilterForm}>
      {/* 日期范围 */}
      <Form.Item
        label={
          <>
            <CalendarOutlined /> 日期
          </>
        }
        style={{ marginBottom: 0 }}
      >
        <Space size="small">
          <RangePicker
            value={dateRange as any}
            onChange={(dates) =>
              onDateRangeChange(dates as [Dayjs | null, Dayjs | null])
            }
            format="YYYY-MM-DD"
            size="small"
            style={{ width: 220 }}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            onClick={onDateFilter}
            title="应用日期筛选"
          />
        </Space>
      </Form.Item>

      {/* 高级筛选 - 使用 Popover */}
      <Form.Item style={{ marginBottom: 0, marginLeft: 'auto' }}>
        <Popover
          title={
            <div className={styles.popoverTitle}>
              <FilterOutlined />
              <span>高级筛选</span>
              <Button
                type="text"
                size="small"
                icon={<PlusOutlined />}
                onClick={onAddCondition}
                style={{ marginLeft: 'auto' }}
                title="添加条件"
              />
            </div>
          }
          content={
            <div className={styles.advancedFilterContent}>
              {conditions.length === 0 ? (
                <div className={styles.emptyHint}>点击 + 添加筛选条件</div>
              ) : (
                <div className={styles.conditionsList}>
                  {conditions.map((condition, index) => (
                    <div key={index} className={styles.conditionRow}>
                      <Select
                        size="small"
                        style={{ width: 100 }}
                        value={condition.field}
                        onChange={(value) =>
                          onConditionChange(index, 'field', value)
                        }
                        options={getFieldOptions()}
                        placeholder="字段"
                      />
                      <Select
                        size="small"
                        style={{ width: 80 }}
                        value={condition.operator}
                        onChange={(value) =>
                          onConditionChange(index, 'operator', value)
                        }
                        options={getOperatorOptions(condition.field)}
                        placeholder="操作"
                      />
                      {condition.field === 'date' &&
                      condition.operator === 'in' ? (
                        <RangePicker
                          size="small"
                          style={{ width: 200 }}
                          value={
                            condition.value as [
                              Dayjs | null,
                              Dayjs | null
                            ]
                          }
                          onChange={(dates) =>
                            onConditionChange(index, 'value', dates)
                          }
                        />
                      ) : ['>', '<', '>=', '<='].includes(
                          condition.operator
                        ) ? (
                        <InputNumber
                          size="small"
                          style={{ width: 100 }}
                          value={condition.value as number}
                          onChange={(value) =>
                            onConditionChange(index, 'value', value)
                          }
                          placeholder="值"
                        />
                      ) : condition.operator === 'in' ||
                        condition.operator === 'not in' ? (
                        <Select
                          mode="multiple"
                          size="small"
                          style={{ width: 180 }}
                          value={condition.value as string[]}
                          onChange={(value) =>
                            onConditionChange(index, 'value', value)
                          }
                          options={
                            dimensions
                              .find((d) => d.code === condition.field)
                              ?.values?.map((v) => ({
                                label: v,
                                value: v,
                              })) || []
                          }
                          placeholder="选择值"
                        />
                      ) : (
                        <Select
                          size="small"
                          style={{ width: 140 }}
                          value={condition.value as string}
                          onChange={(value) =>
                            onConditionChange(index, 'value', value)
                          }
                          options={
                            dimensions
                              .find((d) => d.code === condition.field)
                              ?.values?.map((v) => ({
                                label: v,
                                value: v,
                              })) || []
                          }
                          placeholder="选择值"
                        />
                      )}
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => onRemoveCondition(index)}
                        title="删除条件"
                      />
                    </div>
                  ))}
                  {conditions.length > 0 && (
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      size="small"
                      onClick={onAdvancedFilter}
                      block
                      style={{ marginTop: 8 }}
                    >
                      应用筛选
                    </Button>
                  )}
                </div>
              )}
            </div>
          }
          trigger="click"
          placement="bottomRight"
          overlayStyle={{ width: 500 }}
        >
          <Button
            type={conditions.length > 0 ? 'primary' : 'default'}
            icon={<FilterOutlined />}
            size="small"
            title="高级筛选"
          >
            筛选{conditions.length > 0 && `(${conditions.length})`}
          </Button>
        </Popover>
      </Form.Item>
    </Form>
  )
}

export default FilterSection

