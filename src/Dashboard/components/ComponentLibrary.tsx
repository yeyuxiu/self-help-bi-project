import { Tabs } from 'antd'
import {
  FundOutlined,
  BarChartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import DraggableComponentItem from './DraggableComponentItem'
import { KPI_METRICS, chartTypeOptions, CHART_TYPE_ICONS } from '../constants'
import styles from '../index.less'

const ComponentLibrary = () => {
  return (
    <div className={styles.componentLibrary}>
      <div className={styles.libraryHeader}>
        <AppstoreOutlined className={styles.libraryIcon} />
        <span>组件库</span>
      </div>
      <Tabs
        defaultActiveKey="kpi"
        items={[
          {
            key: 'kpi',
            label: (
              <span>
                <FundOutlined /> KPI指标
              </span>
            ),
            children: (
              <div className={styles.componentList}>
                {KPI_METRICS.map((metric) => (
                  <DraggableComponentItem
                    key={metric.id}
                    id={`kpi-lib-${metric.id}`}
                    type="kpi"
                    name={metric.name}
                    icon={metric.icon}
                    description="拖拽到画布添加指标"
                  />
                ))}
              </div>
            ),
          },
          {
            key: 'chart',
            label: (
              <span>
                <BarChartOutlined /> 图表类型
              </span>
            ),
            children: (
              <div className={styles.componentList}>
                {chartTypeOptions.map((option: any) => (
                  <DraggableComponentItem
                    key={option.value}
                    id={option.value}
                    type="chart"
                    name={option.label}
                    icon={CHART_TYPE_ICONS[option.value]}
                    description="拖拽到画布添加图表"
                  />
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}

export default ComponentLibrary

