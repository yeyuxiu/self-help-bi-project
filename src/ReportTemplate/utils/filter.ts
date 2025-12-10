import dayjs, { Dayjs } from 'dayjs'
import { DataPoint } from '@/Data/mockData'
import { FilterCondition } from '../type'

// 应用日期筛选
export const applyDateFilter = (
  data: DataPoint[],
  dateRange: [Dayjs | null, Dayjs | null]
): DataPoint[] => {
  if (!dateRange[0] || !dateRange[1]) return data

  return data.filter((item) => {
    const itemDate = dayjs(item.date)
    return (
      itemDate.isAfter(dateRange[0]!.subtract(1, 'day')) &&
      itemDate.isBefore(dateRange[1]!.add(1, 'day'))
    )
  })
}

// 应用高级筛选条件
export const applyAdvancedFilter = (
  data: DataPoint[],
  conditions: FilterCondition[]
): DataPoint[] => {
  let filtered = [...data]

  conditions.forEach((condition) => {
    if (
      !condition.field ||
      condition.value === '' ||
      condition.value === null
    ) {
      return
    }

    filtered = filtered.filter((item) => {
      const itemValue = item[condition.field]
      switch (condition.operator) {
        case '=':
          return itemValue === condition.value
        case '!=':
          return itemValue !== condition.value
        case '>':
          return (itemValue as number) > (condition.value as number)
        case '<':
          return (itemValue as number) < (condition.value as number)
        case '>=':
          return (itemValue as number) >= (condition.value as number)
        case '<=':
          return (itemValue as number) <= (condition.value as number)
        case 'in':
          return (condition.value as string[]).includes(itemValue as string)
        case 'not in':
          return !(condition.value as string[]).includes(itemValue as string)
        case 'contains':
          return String(itemValue).includes(String(condition.value))
        default:
          return true
      }
    })
  })

  return filtered
}

