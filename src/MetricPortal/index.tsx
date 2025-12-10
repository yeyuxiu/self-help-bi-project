import { useMemo, useState } from 'react'
import { Card, Space, Spin, Alert, Form } from 'antd'
import { Dayjs } from 'dayjs'
import ChartView from '@/ChartView'
import { useMetrics, useData } from '@/Hooks/useApiQuery'
import { ChartType, ChartConfig } from '@/Data/mockData'
import styles from './index.less'
import MetricSelector from './components/MetricSelector'
import DateFilter from './components/DateFilter'
import AggregationSection from './components/AggregationSection'
import AdvancedFilter from './components/AdvancedFilter'
import DataToolbar from './components/DataToolbar'
import TemplateActions from './components/TemplateActions'
import SavedViews from './components/SavedViews'
import InsightPanel from './components/InsightPanel'
import { AggregationFormValues, AggregateKind, FilterCondition, InsightSummary, SavedView } from './types'

const MetricPortal = () => {
  const [form] = Form.useForm()
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [aggregation, setAggregation] = useState<any>(undefined)
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('chart')
  const [chartType, setChartType] = useState<ChartType>('line')
  const [chartConfig, setChartConfig] = useState<ChartConfig>({})
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null])
  const [conditions, setConditions] = useState<FilterCondition[]>([])
  const [aggregateType, setAggregateType] = useState<AggregateKind>('dimension')

  const {
    data: metricsResponse,
    isLoading: metricsLoading,
    error: metricsError,
  } = useMetrics()

  const {
    data: dataResponse,
    isLoading: dataLoading,
    error: dataError,
    refetch: refetchData,
  } = useData({
    filters,
    aggregation,
  })

  const metrics = useMemo(() => metricsResponse?.data || [], [metricsResponse])
  const filteredData = useMemo(() => dataResponse?.data || [], [dataResponse])
  const insightSummary = useMemo<InsightSummary>(() => {
    const rowCount = filteredData.length
    const dates = filteredData.map((item: any) => item.date).filter(Boolean)
    const dateRangeValue =
      dates.length > 0
        ? {
            start: dates[0],
            end: dates[dates.length - 1],
          }
        : undefined

    const metricId = selectedMetrics[0]
    const targetMetric = metrics.find((m: any) => m.id === metricId)
    let metricStat: InsightSummary['metricStat']
    if (targetMetric) {
      const values = filteredData
        .map((item: any) => Number(item[targetMetric.code]))
        .filter((v: number) => !Number.isNaN(v))
      if (values.length > 0) {
        const sum = values.reduce((acc, cur) => acc + cur, 0)
        metricStat = {
          metricId,
          sum,
          avg: sum / values.length,
          max: Math.max(...values),
          min: Math.min(...values),
        }
      }
    }

    const dimensionCoverage = ['region', 'category', 'product']
      .filter((dim) => filteredData.some((item: any) => item[dim]))
      .map((dim) => ({
        dimension: dim,
        count: new Set(filteredData.map((item: any) => item[dim])).size,
      }))

    return {
      rowCount,
      dateRange: dateRangeValue,
      metricStat,
      dimensionCoverage,
    }
  }, [filteredData, metrics, selectedMetrics])

  const handleMetricChange = (checkedValues: string[]) => {
    setSelectedMetrics(checkedValues)
  }

  const handleDateFilter = () => {
    setFilters({ dateRange })
    refetchData()
  }

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
    setFilters({ conditions })
    refetchData()
  }

  const handleApplyTemplate = (type?: ChartType, cfg?: ChartConfig) => {
    if (type) {
      setChartType(type)
    }
    if (cfg) {
      setChartConfig((prev) => ({ ...prev, ...cfg }))
    }
  }

  const handleApplyView = (view: SavedView) => {
    setSelectedMetrics(view.metrics)
    setChartType(view.chartType)
    setChartConfig(view.chartConfig || {})
  }

  const handleAggregate = () => {
    const values = form.getFieldsValue() as AggregationFormValues
    let aggConfig: any = undefined

    if (aggregateType === 'dimension') {
      if (values.dimension && values.metric && values.aggFunc) {
        aggConfig = {
          dimension: values.dimension,
          aggregate: [{ metric: values.metric, func: values.aggFunc }],
        }
      }
    } else if (values.metric && values.timePeriod && values.timeAggFunc) {
        aggConfig = {
          timePeriod: values.timePeriod,
          metric: values.metric,
          func: values.timeAggFunc,
      }
    }

    setAggregation(aggConfig)
    refetchData()
  }

  const handleReset = () => {
    form.resetFields()
    setDateRange([null, null])
    setConditions([])
    setFilters({})
    setAggregation(undefined)
    refetchData()
  }

  if (metricsError || dataError) {
    return (
      <Alert
        message="数据加载失败"
        description={metricsError?.message || dataError?.message}
        type="error"
        showIcon
      />
    )
  }

  return (
    <div className={styles.metricPortal}>
      <h2>指标门户</h2>
      <Spin spinning={metricsLoading || dataLoading} tip="加载中...">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card size="small" className={styles.configCard}>
            <Form form={form} layout="inline" className={styles.compactForm}>
              <MetricSelector metrics={metrics} selected={selectedMetrics} onChange={handleMetricChange} onReset={handleReset} />
            </Form>
          </Card>

          <Card size="small" className={styles.filterCard}>
            <Form form={form} layout="inline" className={styles.compactFilterForm}>
              <DateFilter value={dateRange} onChange={setDateRange} onApply={handleDateFilter} />
              <AggregationSection aggregateType={aggregateType} onTypeChange={setAggregateType} onAggregate={handleAggregate} />
              <Form.Item style={{ marginBottom: 0, marginLeft: 'auto' }}>
                <AdvancedFilter
                  conditions={conditions}
                  onAdd={handleAddCondition}
                  onRemove={handleRemoveCondition}
                  onChange={handleConditionChange}
                  onApply={handleAdvancedFilter}
                />
              </Form.Item>
            </Form>
          </Card>

          <Card size="small" className={styles.configCard}>
            <Space align="start" size="large" wrap style={{ width: '100%' }}>
              <div style={{ flex: 1, minWidth: 320 }}>
                <TemplateActions metrics={metrics} selectedMetrics={selectedMetrics} onApply={handleApplyTemplate} />
              </div>
              <div style={{ flex: 1, minWidth: 320 }}>
                <SavedViews selectedMetrics={selectedMetrics} chartType={chartType} chartConfig={chartConfig} onApply={handleApplyView} />
              </div>
            </Space>
          </Card>

          <InsightPanel summary={insightSummary} />

          <Card
            title="数据展示"
            size="small"
            extra={
              <DataToolbar
                    chartType={chartType}
                onChartTypeChange={setChartType}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                chartConfig={chartConfig}
                    onConfigChange={setChartConfig}
                metrics={metrics}
                selectedMetrics={selectedMetrics}
                data={filteredData}
              />
            }
          >
            <ChartView
              data={filteredData}
              metrics={metrics.filter((m: { id: string }) => selectedMetrics.includes(m.id))}
              viewMode={viewMode}
              chartType={chartType}
              config={chartConfig}
            />
          </Card>
        </Space>
      </Spin>
    </div>
  )
}

export default MetricPortal
