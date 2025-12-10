import { Popover, Button, Space } from 'antd'
import { FilterOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { FilterCondition } from '../type'
import FilterConditionRow from './FilterConditionRow'
import styles from '../index.less'

interface AdvancedFilterPopoverProps {
  conditions: FilterCondition[]
  onAddCondition: () => void
  onRemoveCondition: (index: number) => void
  onConditionChange: (index: number, field: string, value: any) => void
  onApplyFilter: () => void
}

const AdvancedFilterPopover = ({
  conditions,
  onAddCondition,
  onRemoveCondition,
  onConditionChange,
  onApplyFilter,
}: AdvancedFilterPopoverProps) => {
  return (
    <Popover
      title={
        <div className={styles.popoverTitle}>
          <FilterOutlined />
          <span>高级筛选</span>
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={onAddCondition}
            style={{ marginLeft: 'auto' }}
            title="添加条件"
          />
        </div>
      }
      content={
        <div className={styles.advancedFilterContent}>
          {conditions.length === 0 ? (
            <div className={styles.emptyHint}>点击 + 添加筛选条件</div>
          ) : (
            <div className={styles.conditionsList}>
              {conditions.map((condition, index) => (
                <FilterConditionRow
                  key={index}
                  condition={condition}
                  index={index}
                  onChange={onConditionChange}
                  onRemove={onRemoveCondition}
                />
              ))}
              {conditions.length > 0 && (
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  size="small"
                  onClick={onApplyFilter}
                  block
                  style={{ marginTop: 8 }}
                >
                  应用筛选
                </Button>
              )}
            </div>
          )}
        </div>
      }
      trigger="click"
      placement="bottomRight"
      overlayStyle={{ width: 500 }}
    >
      <Button
        type={conditions.length > 0 ? 'primary' : 'default'}
        icon={<FilterOutlined />}
        size="small"
        title="高级筛选"
      >
        筛选{conditions.length > 0 && `(${conditions.length})`}
      </Button>
    </Popover>
  )
}

export default AdvancedFilterPopover

