import { useState } from 'react'
import { Space, message, Form } from 'antd'
import { Dayjs } from 'dayjs'
import { mockData, DataPoint, ChartType, ChartConfig } from '@/Data/mockData'
import { groupByData, aggregateByTime } from '@/Utils/dataAggregation'
import { FilterCondition } from './type'
import { applyDateFilter, applyAdvancedFilter } from './utils/filter'
import ConfigCard from './components/ConfigCard'
import FilterCard from './components/FilterCard'
import PreviewCard from './components/PreviewCard'
import styles from './index.less'

const ReportTemplate = () => {
  const [form] = Form.useForm()
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState<DataPoint[]>(mockData)
  const [chartType, setChartType] = useState<ChartType>('line')
  const [chartConfig, setChartConfig] = useState<ChartConfig>({})
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ])
  const [conditions, setConditions] = useState<FilterCondition[]>([])
  const [aggregateType, setAggregateType] = useState<'dimension' | 'time'>(
    'dimension'
  )

  const handleSave = () => {
    const values = form.getFieldsValue()
    const template = {
      metrics: selectedMetrics,
      chartType,
      chartConfig,
      filters: values,
    }
    localStorage.setItem('reportTemplate', JSON.stringify(template))
    message.success('报表模板保存成功')
  }

  const handleMetricChange = (value: string[]) => {
    setSelectedMetrics(value)
  }

  // 日期筛选
  const handleDateFilter = () => {
    const filtered = applyDateFilter(mockData, dateRange)
    applyAllFilters(filtered)
  }

  // 高级筛选
  const handleAddCondition = () => {
    setConditions([...conditions, { field: 'date', operator: '=', value: '' }])
  }

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const handleConditionChange = (index: number, field: string, value: any) => {
    const newConditions = [...conditions]
    newConditions[index] = { ...newConditions[index], [field]: value }
    setConditions(newConditions)
  }

  const handleAdvancedFilter = () => {
    let filtered = applyDateFilter(mockData, dateRange)
    filtered = applyAdvancedFilter(filtered, conditions)
    applyAllFilters(filtered)
  }

  // 数据聚合
  const handleAggregate = () => {
    const values = form.getFieldsValue()
    let data = [...filteredData]

    if (aggregateType === 'dimension') {
      if (values.dimension && values.metric && values.aggFunc) {
        data = groupByData(data, {
          dimension: values.dimension,
          aggregate: [{ metric: values.metric, func: values.aggFunc }],
        })
      }
    } else {
      if (values.metric && values.timePeriod && values.timeAggFunc) {
        data = aggregateByTime(
          data,
          values.timePeriod,
          values.metric,
          values.timeAggFunc
        )
      }
    }
    setFilteredData(data)
  }

  // 应用所有筛选
  const applyAllFilters = (data: DataPoint[]) => {
    setFilteredData(data)
  }

  // 重置所有筛选
  const handleReset = () => {
    form.resetFields()
    setDateRange([null, null])
    setConditions([])
    setFilteredData(mockData)
    message.info('已重置所有筛选')
  }

  return (
    <div className={styles.reportTemplate}>
      <h2>报表模板</h2>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <ConfigCard
          selectedMetrics={selectedMetrics}
          chartType={chartType}
          onMetricChange={handleMetricChange}
          onChartTypeChange={setChartType}
          onReset={handleReset}
          onSave={handleSave}
        />
        <FilterCard
          dateRange={dateRange}
          conditions={conditions}
          aggregateType={aggregateType}
          onDateRangeChange={setDateRange}
          onDateFilter={handleDateFilter}
          onAddCondition={handleAddCondition}
          onRemoveCondition={handleRemoveCondition}
          onConditionChange={handleConditionChange}
          onAdvancedFilter={handleAdvancedFilter}
          onAggregateTypeChange={setAggregateType}
          onAggregate={handleAggregate}
        />
        <PreviewCard
          selectedMetrics={selectedMetrics}
          filteredData={filteredData}
          chartType={chartType}
          chartConfig={chartConfig}
          onConfigChange={setChartConfig}
        />
      </Space>
    </div>
  )
}

export default ReportTemplate
