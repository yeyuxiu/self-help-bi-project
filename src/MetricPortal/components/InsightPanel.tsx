import { Card, Col, Row, Statistic, Tag, Tooltip } from 'antd'
import { InfoCircleOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { InsightSummary } from '../types'
import styles from '../index.less'

interface InsightPanelProps {
  summary: InsightSummary
}

const InsightPanel = ({ summary }: InsightPanelProps) => {
  const { rowCount, dateRange, metricStat, dimensionCoverage } = summary

  return (
    <Card size="small" className={styles.insightCard} title="智能洞察" extra={<Tag icon={<ThunderboltOutlined />} color="gold">快速摘要</Tag>}>
      <Row gutter={12}>
        <Col span={6}>
          <Statistic title="数据条目" value={rowCount} />
          {dateRange && (
            <div className={styles.subInfo}>
              <Tooltip title="数据时间范围">
                <InfoCircleOutlined style={{ color: '#8c8c8c', marginRight: 4 }} />
              </Tooltip>
              <span>{dateRange.start} - {dateRange.end}</span>
            </div>
          )}
        </Col>
        <Col span={10}>
          <Statistic
            title="指标分布"
            value={metricStat ? metricStat.avg.toFixed(2) : '--'}
            suffix={metricStat ? `(均值)` : ''}
          />
          {metricStat && (
            <div className={styles.subInfo}>
              <span>Max: {metricStat.max.toLocaleString()} | Min: {metricStat.min.toLocaleString()} | Sum: {metricStat.sum.toLocaleString()}</span>
            </div>
          )}
        </Col>
        <Col span={8}>
          <div className={styles.dimensionChips}>
            {dimensionCoverage.map((d) => (
              <Tag key={d.dimension} color="blue">
                {d.dimension} {d.count} 类
              </Tag>
            ))}
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default InsightPanel

