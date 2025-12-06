import { useMemo } from 'react';
import { Table, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import { Metric, DataPoint, ChartType, ChartConfig, defaultTheme } from '@/Data/mockData';
import styles from './index.less';

interface ChartViewProps {
  data: DataPoint[];
  metrics: Metric[];
  viewMode: 'table' | 'chart';
  chartType?: ChartType;
  config?: ChartConfig;
  onChartClick?: (params: any) => void;
}

const ChartView = ({
  data,
  metrics,
  viewMode,
  chartType = 'line',
  config = {},
  onChartClick,
}: ChartViewProps) => {
  const chartOption = useMemo(() => {
    if (metrics.length === 0) {
      return null;
    }

    const colors = config.colors || defaultTheme.color;
    const dates = data.map((item) => item.date);
    const showLegend = config.showLegend !== false;
    const showTooltip = config.showTooltip !== false;

    // 散点图
    if (chartType === 'scatter') {
      return {
        color: colors,
        title: config.title ? { text: config.title, left: 'center' } : undefined,
        tooltip: showTooltip ? {
          trigger: 'item',
          formatter: (params: any) => {
            return `${params.seriesName}<br/>${params.value[0]}: ${params.value[1]}`;
          },
        } : undefined,
        legend: showLegend ? {
          data: metrics.map((m) => m.name),
          bottom: 0,
        } : undefined,
        grid: {
          left: '3%',
          right: '4%',
          bottom: showLegend ? '15%' : '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'value',
        },
        series: metrics.map((metric) => ({
          name: metric.name,
          type: 'scatter',
          data: data.map((item, index) => [
            index,
            item[metric.code] as number,
          ]),
        })),
      };
    }

    // 雷达图
    if (chartType === 'radar') {
      const maxValues = metrics.map((metric) => {
        const values = data.map((item) => item[metric.code] as number);
        return Math.max(...values, 0) * 1.2;
      });

      return {
        color: colors,
        title: config.title ? { text: config.title, left: 'center' } : undefined,
        tooltip: showTooltip ? { trigger: 'item' } : undefined,
        legend: showLegend ? {
          data: dates.slice(0, 5), // 只显示前5个
          bottom: 0,
        } : undefined,
        radar: {
          indicator: metrics.map((metric, index) => ({
            name: metric.name,
            max: maxValues[index],
          })),
        },
        series: [
          {
            type: 'radar',
            data: data.slice(0, 5).map((item) => ({
              value: metrics.map((metric) => item[metric.code] as number),
              name: item.date,
            })),
          },
        ],
      };
    }

    // 热力图
    if (chartType === 'heatmap') {
      const heatmapData: number[][] = [];
      dates.forEach((date, dateIndex) => {
        metrics.forEach((metric, metricIndex) => {
          heatmapData.push([
            metricIndex,
            dateIndex,
            data[dateIndex][metric.code] as number,
          ]);
        });
      });

      return {
        color: colors,
        title: config.title ? { text: config.title, left: 'center' } : undefined,
        tooltip: showTooltip ? {
          position: 'top',
          formatter: (params: any) => {
            return `${metrics[params.data[0]].name}<br/>${dates[params.data[1]]}: ${params.data[2]}`;
          },
        } : undefined,
        grid: {
          height: '50%',
          top: '10%',
        },
        xAxis: {
          type: 'category',
          data: dates,
          splitArea: {
            show: true,
          },
        },
        yAxis: {
          type: 'category',
          data: metrics.map((m) => m.name),
          splitArea: {
            show: true,
          },
        },
        visualMap: {
          min: 0,
          max: Math.max(...data.flatMap((item) => metrics.map((m) => item[m.code] as number))),
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%',
        },
        series: [
          {
            name: '数据',
            type: 'heatmap',
            data: heatmapData,
            label: {
              show: false,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    }

    // 气泡图
    if (chartType === 'bubble') {
      return {
        color: colors,
        title: config.title ? { text: config.title, left: 'center' } : undefined,
        tooltip: showTooltip ? {
          trigger: 'item',
        } : undefined,
        legend: showLegend ? {
          data: metrics.map((m) => m.name),
          bottom: 0,
        } : undefined,
        grid: {
          left: '3%',
          right: '4%',
          bottom: showLegend ? '15%' : '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'value',
        },
        series: metrics.map((metric, index) => ({
          name: metric.name,
          type: 'scatter',
          symbolSize: (data: number[]) => Math.sqrt(data[2]) / 10,
          data: data.map((item, i) => [
            i,
            item[metric.code] as number,
            item[metric.code] as number,
          ]),
        })),
      };
    }

    // 漏斗图
    if (chartType === 'funnel') {
      return {
        color: colors,
        title: config.title ? { text: config.title, left: 'center' } : undefined,
        tooltip: showTooltip ? {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        } : undefined,
        legend: showLegend ? {
          data: dates.slice(0, 10),
          bottom: 0,
        } : undefined,
        series: [
          {
            name: metrics[0]?.name || '数据',
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: Math.max(...data.map((item) => item[metrics[0]?.code || ''] as number)),
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside',
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid',
              },
        },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 20,
              },
            },
            data: data.slice(0, 10).map((item) => ({
              value: item[metrics[0]?.code || ''] as number,
              name: item.date,
            })),
          },
        ],
      };
    }

    // 仪表盘
    if (chartType === 'gauge') {
      const value = data.length > 0 
        ? (data[data.length - 1][metrics[0]?.code || ''] as number)
        : 0;
      const max = Math.max(...data.map((item) => item[metrics[0]?.code || ''] as number));

      return {
        color: colors,
        title: config.title ? { text: config.title, left: 'center' } : undefined,
        tooltip: showTooltip ? {
          formatter: '{a} <br/>{b}: {c}',
        } : undefined,
        series: [
          {
            name: metrics[0]?.name || '数据',
            type: 'gauge',
            progress: {
              show: true,
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}',
            },
            data: [
              {
                value,
                name: metrics[0]?.name || '数据',
              },
            ],
            min: 0,
            max,
          },
        ],
      };
    }

    // 矩形树图
    if (chartType === 'treemap') {
      return {
        color: colors,
        title: config.title ? { text: config.title, left: 'center' } : undefined,
        tooltip: showTooltip ? {
          trigger: 'item',
          formatter: '{b}: {c}',
        } : undefined,
        series: [
          {
            type: 'treemap',
            data: data.slice(0, 20).map((item) => ({
              value: item[metrics[0]?.code || ''] as number,
              name: item.date,
            })),
          },
        ],
      };
    }

    // 饼图
    if (chartType === 'pie') {
      return {
        color: colors,
        title: config.title ? { text: config.title, left: 'center' } : undefined,
        tooltip: showTooltip ? {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        } : undefined,
        legend: showLegend ? {
          orient: 'vertical',
          left: 'left',
        } : undefined,
        series: [
          {
            name: metrics[0]?.name || '数据',
            type: 'pie',
            radius: config.radius || '50%',
            data: data.slice(0, 10).map((item) => ({
              value: item[metrics[0]?.code || ''] as number,
              name: item.date,
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    }

    // 折线图、柱状图、面积图
    const series = metrics.map((metric, index) => {
      const baseSeries: any = {
        name: metric.name,
        type: chartType === 'area' ? 'line' : chartType,
        data: data.map((item) => item[metric.code] as number),
      };

      if (chartType === 'line' || chartType === 'area') {
        baseSeries.smooth = config.smooth !== false;
        if (chartType === 'area') {
          baseSeries.areaStyle = {};
        }
        if (config.stack) {
          baseSeries.stack = 'total';
        }
      }

      return baseSeries;
    });

    return {
      color: colors,
      title: config.title ? { text: config.title, left: 'center' } : undefined,
      tooltip: showTooltip ? {
        trigger: 'axis',
      } : undefined,
      legend: showLegend ? {
        data: metrics.map((m) => m.name),
        bottom: 0,
      } : undefined,
      grid: {
        left: '3%',
        right: '4%',
        bottom: showLegend ? '15%' : '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: chartType === 'line' || chartType === 'area',
        data: dates,
      },
      yAxis: {
        type: 'value',
      },
      series,
    };
  }, [data, metrics, chartType, config]);

  const tableColumns: ColumnsType<DataPoint> = useMemo(() => {
    const baseColumns: ColumnsType<DataPoint> = [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        fixed: 'left',
      },
    ];

    // 添加维度列
    if (data.length > 0 && data[0].region) {
      baseColumns.push({
        title: '地区',
        dataIndex: 'region',
        key: 'region',
      });
    }
    if (data.length > 0 && data[0].category) {
      baseColumns.push({
        title: '类别',
        dataIndex: 'category',
        key: 'category',
      });
    }
    if (data.length > 0 && data[0].product) {
      baseColumns.push({
        title: '产品',
        dataIndex: 'product',
        key: 'product',
      });
    }

    const metricColumns = metrics.map((metric) => ({
      title: `${metric.name} (${metric.unit || ''})`,
      dataIndex: metric.code,
      key: metric.code,
      render: (value: number) => {
        if (metric.type === 'currency') {
          return `¥${value.toLocaleString()}`;
        }
        if (metric.type === 'percent') {
          return `${value}%`;
        }
        return value.toLocaleString();
      },
    }));

    return [...baseColumns, ...metricColumns];
  }, [metrics, data]);

  if (metrics.length === 0) {
    return (
      <Empty
        description="请先选择指标"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  if (viewMode === 'table') {
    return (
      <div className={styles.chartView}>
        <Table
          dataSource={data}
          columns={tableColumns}
          rowKey={(record, index) => `${record.date}-${index}`}
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.chartView}>
      {chartOption && (
        <ReactECharts
          option={chartOption}
          style={{ height: `${config.height || 400}px`, width: '100%' }}
          opts={{ renderer: 'canvas' }}
          onEvents={onChartClick ? { click: onChartClick } : undefined}
        />
      )}
    </div>
  );
};

export default ChartView;
