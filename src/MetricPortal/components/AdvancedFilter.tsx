import { Button, Popover, Select, DatePicker, InputNumber } from 'antd'
import { FilterOutlined, PlusOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import { Dayjs } from 'dayjs'
import { dimensions } from '@/Data/mockData'
import styles from '../index.less'
import { FilterCondition } from '../types'
import { getFieldOptions, getOperatorOptions } from '../constants/options'

const { RangePicker } = DatePicker

interface AdvancedFilterProps {
  conditions: FilterCondition[]
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, field: string, value: any) => void
  onApply: () => void
}

const AdvancedFilter = ({ conditions, onAdd, onRemove, onChange, onApply }: AdvancedFilterProps) => {
  const renderValueInput = (condition: FilterCondition, index: number) => {
    if (condition.field === 'date' && condition.operator === 'in') {
      return (
        <RangePicker
          size="small"
          style={{ width: 200 }}
          value={condition.value as [Dayjs | null, Dayjs | null]}
          onChange={(dates) => onChange(index, 'value', dates)}
        />
      )
    }

    if (['>', '<', '>=', '<='].includes(condition.operator)) {
      return (
        <InputNumber
          size="small"
          style={{ width: 100 }}
          value={condition.value as number}
          onChange={(value) => onChange(index, 'value', value)}
          placeholder="值"
        />
      )
    }

    if (condition.operator === 'in' || condition.operator === 'not in') {
      return (
        <Select
          mode="multiple"
          size="small"
          style={{ width: 180 }}
          value={condition.value as string[]}
          onChange={(value) => onChange(index, 'value', value)}
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
      )
    }

    return (
      <Select
        size="small"
        style={{ width: 140 }}
        value={condition.value as string}
        onChange={(value) => onChange(index, 'value', value)}
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
    )
  }

  const content = (
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
                onChange={(value) => onChange(index, 'field', value)}
                options={getFieldOptions(dimensions)}
                placeholder="字段"
              />
              <Select
                size="small"
                style={{ width: 80 }}
                value={condition.operator}
                onChange={(value) => onChange(index, 'operator', value)}
                options={getOperatorOptions(condition.field)}
                placeholder="操作"
              />
              {renderValueInput(condition, index)}
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => onRemove(index)}
                title="删除条件"
              />
            </div>
          ))}
          {conditions.length > 0 && (
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="small"
              onClick={onApply}
              block
              style={{ marginTop: 8 }}
            >
              应用筛选
            </Button>
          )}
        </div>
      )}
    </div>
  )

  return (
    <Popover
      title={
        <div className={styles.popoverTitle}>
          <FilterOutlined />
          <span>高级筛选</span>
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={onAdd}
            style={{ marginLeft: 'auto' }}
            title="添加条件"
          />
        </div>
      }
      content={content}
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
  )
}

export default AdvancedFilter

