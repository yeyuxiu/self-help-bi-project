import { Checkbox, Space } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Metric } from '@/Data/mockData';
import styles from './index.less';

interface MetricSelectorProps {
  metrics: Metric[];
  selectedMetrics: string[];
  onChange: (selectedIds: string[]) => void;
}

const MetricSelector = ({
  metrics,
  selectedMetrics,
  onChange,
}: MetricSelectorProps) => {
  const handleChange = (checkedValues: CheckboxValueType[]) => {
    onChange(checkedValues as string[]);
  };

  return (
    <div className={styles.metricSelector}>
      <Checkbox.Group
        value={selectedMetrics}
        onChange={handleChange}
        style={{ width: '100%' }}
      >
        <Space wrap>
          {metrics.map((metric) => (
            <Checkbox key={metric.id} value={metric.id}>
              {metric.name} ({metric.unit || ''})
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
    </div>
  );
};

export default MetricSelector;

