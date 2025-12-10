import { Form, Space, Button, DatePicker } from 'antd'
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons'
import { Dayjs } from 'dayjs'
import styles from '../index.less'

const { RangePicker } = DatePicker

interface DateFilterProps {
  value: [Dayjs | null, Dayjs | null]
  onChange: (range: [Dayjs | null, Dayjs | null]) => void
  onApply: () => void
}

const DateFilter = ({ value, onChange, onApply }: DateFilterProps) => {
  return (
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
          value={value as any}
          onChange={(dates) => onChange(dates as [Dayjs | null, Dayjs | null])}
          format="YYYY-MM-DD"
          size="small"
          style={{ width: 220 }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          size="small"
          onClick={onApply}
          title="应用日期筛选"
          className={styles.applyBtn}
        />
      </Space>
    </Form.Item>
  )
}

export default DateFilter

