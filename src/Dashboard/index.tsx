import { Row, Col, Card, Statistic, Spin, Alert } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useKpiData, useChartData } from '@/Hooks/useApiQuery';
import styles from './index.less';

const Dashboard = () => {
  const {
    data: kpiData,
    isLoading: kpiLoading,
    error: kpiError,
  } = useKpiData();

  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError,
  } = useChartData();

  if (kpiError || chartError) {
    return (
      <Alert
        message="数据加载失败"
        description={kpiError?.message || chartError?.message}
        type="error"
        showIcon
      />
    );
  }

  const kpi = kpiData?.data;
  const charts = chartData?.data;

  // 销售额趋势图配置
  const salesChartOption = charts?.salesTrend
    ? {
        title: {
          text: '销售额趋势',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: charts.salesTrend.map((item) => item.date),
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (value: number) => `¥${(value / 10000).toFixed(1)}万`,
          },
        },
        series: [
          {
            name: '销售额',
            type: 'line',
            smooth: true,
            data: charts.salesTrend.map((item) => item.value),
            areaStyle: {},
            itemStyle: {
              color: '#1890ff',
            },
          },
        ],
      }
    : null;

  // 订单趋势图配置
  const ordersChartOption = charts?.ordersTrend
    ? {
        title: {
          text: '订单趋势',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: charts.ordersTrend.map((item) => item.date),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '订单数',
            type: 'bar',
            data: charts.ordersTrend.map((item) => item.value),
            itemStyle: {
              color: '#52c41a',
            },
          },
        ],
      }
    : null;

  // 地区分布饼图配置
  const regionChartOption = charts?.regionDistribution
    ? {
        title: {
          text: '地区销售额分布',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: ¥{c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '销售额',
            type: 'pie',
            radius: '60%',
            data: Object.entries(charts.regionDistribution).map(([name, value]) => ({
              value,
              name,
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
      }
    : null;

  // 类别分布柱状图配置
  const categoryChartOption = charts?.categoryDistribution
    ? {
        title: {
          text: '产品类别订单分布',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: Object.keys(charts.categoryDistribution),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '订单数',
            type: 'bar',
            data: Object.values(charts.categoryDistribution),
            itemStyle: {
              color: '#faad14',
            },
          },
        ],
      }
    : null;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>KPI首页</h2>
        <p className={styles.subtitle}>实时数据监控与分析</p>
      </div>

      <Spin spinning={kpiLoading || chartLoading} tip="加载中...">
        <div className={styles.content}>
          {/* KPI 指标卡片 */}
          <Row gutter={[16, 16]} className={styles.kpiRow}>
            <Col xs={24} sm={12} lg={6}>
              <Card className={styles.kpiCard}>
                <Statistic
                  title={
                    <div className={styles.statTitle}>
                      <DollarOutlined className={styles.icon} />
                      <span>总销售额</span>
                    </div>
                  }
                  value={kpi?.totalSales || 0}
                  precision={2}
                  valueStyle={{
                    color: kpi?.salesTrend === 'up' ? '#3f8600' : '#cf1322',
                  }}
                  prefix={
                    kpi?.salesTrend === 'up' ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                  suffix="元"
                />
                {kpi?.salesChange !== undefined && (
                  <div className={styles.change}>
                    较昨日: {kpi.salesChange > 0 ? '+' : ''}
                    {kpi.salesChange.toLocaleString()} 元
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className={styles.kpiCard}>
                <Statistic
                  title={
                    <div className={styles.statTitle}>
                      <ShoppingOutlined className={styles.icon} />
                      <span>订单数量</span>
                    </div>
                  }
                  value={kpi?.totalOrders || 0}
                  valueStyle={{
                    color: kpi?.ordersTrend === 'up' ? '#3f8600' : '#cf1322',
                  }}
                  prefix={
                    kpi?.ordersTrend === 'up' ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                  suffix="单"
                />
                {kpi?.ordersChange !== undefined && (
                  <div className={styles.change}>
                    较昨日: {kpi.ordersChange > 0 ? '+' : ''}
                    {kpi.ordersChange} 单
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className={styles.kpiCard}>
                <Statistic
                  title={
                    <div className={styles.statTitle}>
                      <UserOutlined className={styles.icon} />
                      <span>用户数量</span>
                    </div>
                  }
                  value={kpi?.totalUsers || 0}
                  valueStyle={{
                    color: kpi?.usersTrend === 'up' ? '#3f8600' : '#cf1322',
                  }}
                  prefix={
                    kpi?.usersTrend === 'up' ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                  suffix="人"
                />
                {kpi?.usersChange !== undefined && (
                  <div className={styles.change}>
                    较昨日: {kpi.usersChange > 0 ? '+' : ''}
                    {kpi.usersChange} 人
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className={styles.kpiCard}>
                <Statistic
                  title={
                    <div className={styles.statTitle}>
                      <RiseOutlined className={styles.icon} />
                      <span>平均转化率</span>
                    </div>
                  }
                  value={kpi?.avgConversion || 0}
                  precision={2}
                  valueStyle={{
                    color: kpi?.conversionTrend === 'up' ? '#3f8600' : '#cf1322',
                  }}
                  prefix={
                    kpi?.conversionTrend === 'up' ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                  suffix="%"
                />
                {kpi?.conversionChange !== undefined && (
                  <div className={styles.change}>
                    较昨日: {kpi.conversionChange > 0 ? '+' : ''}
                    {kpi.conversionChange.toFixed(2)}%
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* 图表区域 */}
          <Row gutter={[16, 16]} className={styles.chartRow}>
            <Col xs={24} lg={12}>
              <Card title="销售额趋势" className={styles.chartCard}>
                {salesChartOption ? (
                  <ReactECharts
                    option={salesChartOption}
                    style={{ height: '300px', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                  />
                ) : (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin />
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="订单趋势" className={styles.chartCard}>
                {ordersChartOption ? (
                  <ReactECharts
                    option={ordersChartOption}
                    style={{ height: '300px', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                  />
                ) : (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin />
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="地区销售额分布" className={styles.chartCard}>
                {regionChartOption ? (
                  <ReactECharts
                    option={regionChartOption}
                    style={{ height: '300px', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                  />
                ) : (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin />
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="产品类别订单分布" className={styles.chartCard}>
                {categoryChartOption ? (
                  <ReactECharts
                    option={categoryChartOption}
                    style={{ height: '300px', width: '100%' }}
                    opts={{ renderer: 'canvas' }}
                  />
                ) : (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin />
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
};

export default Dashboard;
