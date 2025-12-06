import { useState, useMemo } from 'react';
import { Card, Space, Button, Tabs, Select, Spin, Alert } from 'antd';
import { TableOutlined, BarChartOutlined, DownloadOutlined } from '@ant-design/icons';
import MetricSelector from '@/MetricSelector';
import QueryFilter from '@/QueryFilter';
import AdvancedFilter from '@/Components/AdvancedFilter';
import DataAggregation from '@/Components/DataAggregation';
import ChartView from '@/ChartView';
import ChartConfigPanel from '@/Components/ChartConfigPanel';
import { useMetrics, useData } from '@/Hooks/useApiQuery';
import { ChartType, chartTypeOptions, ChartConfig, DataPoint } from '@/Data/mockData';
import { exportToCSV } from '@/Utils/export';
import styles from './index.less';

const MetricPortal = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [aggregation, setAggregation] = useState<any>(undefined);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('chart');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  // 使用统一的请求 hooks
  const {
    data: metricsResponse,
    isLoading: metricsLoading,
    error: metricsError,
  } = useMetrics();

  const {
    data: dataResponse,
    isLoading: dataLoading,
    error: dataError,
    refetch: refetchData,
  } = useData({
    filters,
    aggregation,
  });

  const metrics = useMemo(() => metricsResponse?.data || [], [metricsResponse]);
  const filteredData = useMemo(() => dataResponse?.data || [], [dataResponse]);

  const handleMetricChange = (metricIds: string[]) => {
    setSelectedMetrics(metricIds);
  };

  const handleFilterChange = (_data: DataPoint[]) => {
    // 这里可以触发重新请求，或者直接使用本地数据
    // 为了演示，我们使用本地筛选
    setFilters({});
  };

  const handleAggregated = (aggConfig: any) => {
    setAggregation(aggConfig);
    refetchData();
  };

  const tabItems = [
    {
      key: 'chart',
      label: (
        <span>
          <BarChartOutlined />
          图表视图
        </span>
      ),
    },
    {
      key: 'table',
      label: (
        <span>
          <TableOutlined />
          表格视图
        </span>
      ),
    },
  ];

  if (metricsError || dataError) {
    return (
      <Alert
        message="数据加载失败"
        description={metricsError?.message || dataError?.message}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className={styles.metricPortal}>
      <h2>指标门户</h2>
      <Spin spinning={metricsLoading || dataLoading} tip="加载中...">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="指标选择器">
            <MetricSelector
              metrics={metrics}
              selectedMetrics={selectedMetrics}
              onChange={handleMetricChange}
            />
          </Card>

          <Card title="查询筛选">
            <QueryFilter data={filteredData} onFilterChange={handleFilterChange} />
          </Card>

          <AdvancedFilter data={filteredData} onFilterChange={handleFilterChange} />

          <DataAggregation data={filteredData} onAggregated={handleAggregated} />

        <Card
          title="数据展示"
          extra={
            <Space>
              <Select
                value={chartType}
                onChange={setChartType}
                style={{ width: 120 }}
                options={chartTypeOptions}
              />
              <Tabs
                activeKey={viewMode}
                items={tabItems}
                onChange={(key) => setViewMode(key as 'table' | 'chart')}
                size="small"
              />
              {viewMode === 'chart' && (
                <ChartConfigPanel
                  chartType={chartType}
                  config={chartConfig}
                  onConfigChange={setChartConfig}
                />
              )}
              <Button
                icon={<DownloadOutlined />}
                onClick={() => {
                  const selectedMetricList = metrics.filter((m: { id: string }) =>
                    selectedMetrics.includes(m.id)
                  );
                  if (selectedMetricList.length === 0) {
                    return;
                  }
                  exportToCSV(filteredData, selectedMetricList, '指标数据');
                }}
                disabled={selectedMetrics.length === 0}
              >
                导出数据
              </Button>
            </Space>
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
  );
}

export default MetricPortal;

