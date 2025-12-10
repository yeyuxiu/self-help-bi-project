import { Select, InputNumber, DatePicker, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Dayjs } from 'dayjs'
import { FilterCondition } from '../type'
import { getFieldOptions, getOperatorOptions } from '../constants'
import { dimensions } from '@/Data/mockData'

const { RangePicker } = DatePicker

interface FilterConditionRowProps {
  condition: FilterCondition
  index: number
  onChange: (index: number, field: string, value: any) => void
  onRemove: (index: number) => void
}

const FilterConditionRow = ({
  condition,
  index,
  onChange,
  onRemove,
}: FilterConditionRowProps) => {
  const renderValueInput = () => {
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

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
      <Select
        size="small"
        style={{ width: 100 }}
        value={condition.field}
        onChange={(value) => onChange(index, 'field', value)}
        options={getFieldOptions()}
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
      {renderValueInput()}
      <Button
        type="text"
        danger
        size="small"
        icon={<DeleteOutlined />}
        onClick={() => onRemove(index)}
        title="删除条件"
      />
    </div>
  )
}

export default FilterConditionRow

