import { Card, Form, DatePicker, Space, Button } from 'antd'
import { CalendarOutlined, BarChartOutlined } from '@ant-design/icons'
import { Dayjs } from 'dayjs'
import { FilterCondition } from '../type'
import FilterSection from './FilterSection'
import AggregateSection from './AggregateSection'
import AdvancedFilterPopover from './AdvancedFilterPopover'
import styles from '../index.less'

const { RangePicker } = DatePicker

interface FilterCardProps {
  dateRange: [Dayjs | null, Dayjs | null]
  conditions: FilterCondition[]
  aggregateType: 'dimension' | 'time'
  onDateRangeChange: (dates: [Dayjs | null, Dayjs | null]) => void
  onDateFilter: () => void
  onAddCondition: () => void
  onRemoveCondition: (index: number) => void
  onConditionChange: (index: number, field: string, value: any) => void
  onAdvancedFilter: () => void
  onAggregateTypeChange: (type: 'dimension' | 'time') => void
  onAggregate: () => void
}

const FilterCard = ({
  dateRange,
  conditions,
  aggregateType,
  onDateRangeChange,
  onDateFilter,
  onAddCondition,
  onRemoveCondition,
  onConditionChange,
  onAdvancedFilter,
  onAggregateTypeChange,
  onAggregate,
}: FilterCardProps) => {
  return (
    <Card size="small" className={styles.filterCard}>
      <Form layout="inline" className={styles.compactFilterForm}>
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
              icon={<CalendarOutlined />}
              size="small"
              onClick={onDateFilter}
              title="应用日期筛选"
            />
          </Space>
        </Form.Item>

        <AggregateSection
          aggregateType={aggregateType}
          onAggregateTypeChange={onAggregateTypeChange}
          onAggregate={onAggregate}
        />

        <Form.Item style={{ marginBottom: 0, marginLeft: 'auto' }}>
          <AdvancedFilterPopover
            conditions={conditions}
            onAddCondition={onAddCondition}
            onRemoveCondition={onRemoveCondition}
            onConditionChange={onConditionChange}
            onApplyFilter={onAdvancedFilter}
          />
        </Form.Item>
      </Form>
    </Card>
  )
}

export default FilterCard

