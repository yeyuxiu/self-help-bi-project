import { useState } from 'react';
import { Card, Form, Select, Button, Space, message } from 'antd';
import { SaveOutlined, DownloadOutlined } from '@ant-design/icons';
import ChartView from '@/ChartView';
import QueryFilter from '@/QueryFilter';
import AdvancedFilter from '@/Components/AdvancedFilter';
import DataAggregation from '@/Components/DataAggregation';
import ChartConfigPanel from '@/Components/ChartConfigPanel';
import { metrics, mockData, DataPoint, ChartType, chartTypeOptions, ChartConfig } from '@/Data/mockData';
import { exportToCSV } from '@/Utils/export';
import styles from './index.less';

const ReportTemplate = () => {
  const [form] = Form.useForm();
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<DataPoint[]>(mockData);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});

  const handleSave = () => {
    const values = form.getFieldsValue();
    const template = {
      metrics: selectedMetrics,
      chartType,
      chartConfig,
      filters: values,
    };
    // 这里可以保存到 localStorage 或发送到后端
    localStorage.setItem('reportTemplate', JSON.stringify(template));
    message.success('报表模板保存成功');
  };

  const handleMetricChange = (value: string[]) => {
    setSelectedMetrics(value);
  };

  const handleFilterChange = (data: DataPoint[]) => {
    setFilteredData(data);
  };

  return (
    <div className={styles.reportTemplate}>
      <h2>报表模板</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="筛选条件配置">
          <Form form={form} layout="inline">
            <Form.Item label="选择指标" name="metrics">
              <Select
                mode="multiple"
                style={{ width: 300 }}
                placeholder="请选择指标"
                value={selectedMetrics}
                onChange={handleMetricChange}
                options={metrics.map((m) => ({
                  label: `${m.name} (${m.unit || ''})`,
                  value: m.id,
                }))}
              />
            </Form.Item>
            <Form.Item label="图表类型" name="chartType">
              <Select
                style={{ width: 200 }}
                value={chartType}
                onChange={setChartType}
                options={chartTypeOptions}
              />
            </Form.Item>
          </Form>
        </Card>

        <Card title="数据筛选">
          <QueryFilter data={mockData} onFilterChange={handleFilterChange} />
        </Card>

        <AdvancedFilter data={mockData} onFilterChange={handleFilterChange} />

        <DataAggregation data={filteredData} onAggregated={setFilteredData} />

        <Card
          title="报表预览"
          extra={
            <Space>
              <ChartConfigPanel
                chartType={chartType}
                config={chartConfig}
                onConfigChange={setChartConfig}
              />
              <Button
                icon={<DownloadOutlined />}
                onClick={() => {
                  const selectedMetricList = metrics.filter((m) =>
                    selectedMetrics.includes(m.id)
                  );
                  if (selectedMetricList.length === 0) {
                    message.warning('请先选择指标');
                    return;
                  }
                  exportToCSV(filteredData, selectedMetricList, '报表数据');
                }}
                disabled={selectedMetrics.length === 0}
              >
                导出数据
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
              >
                保存模板
              </Button>
            </Space>
          }
        >
          <ChartView
            data={filteredData}
            metrics={metrics.filter((m) => selectedMetrics.includes(m.id))}
            viewMode="chart"
            chartType={chartType}
            config={chartConfig}
          />
        </Card>
      </Space>
    </div>
  );
};

export default ReportTemplate;

