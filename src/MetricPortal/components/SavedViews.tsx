import { useState } from 'react'
import { Button, Input, List, Space, Tag, Popconfirm, message } from 'antd'
import { SaveOutlined, DeleteOutlined, RocketOutlined } from '@ant-design/icons'
import { ChartConfig, ChartType } from '@/Data/mockData'
import { SavedView } from '../types'
import { loadSavedViews, removeView, saveView } from '../utils/storage'

interface SavedViewsProps {
  selectedMetrics: string[]
  chartType: ChartType
  chartConfig: ChartConfig
  onApply: (view: SavedView) => void
}

const SavedViews = ({ selectedMetrics, chartType, chartConfig, onApply }: SavedViewsProps) => {
  const [views, setViews] = useState<SavedView[]>(loadSavedViews())
  const [name, setName] = useState('')

  const handleSave = () => {
    if (selectedMetrics.length === 0) {
      message.warning('请先选择指标再保存视图')
      return
    }
    if (!name.trim()) {
      message.warning('请填写视图名称')
      return
    }
    const view: SavedView = {
      id: Date.now().toString(),
      name: name.trim(),
      metrics: selectedMetrics,
      chartType,
      chartConfig,
      createdAt: Date.now(),
    }
    saveView(view)
    setViews(loadSavedViews())
    setName('')
    message.success('视图已保存')
  }

  const handleRemove = (id: string) => {
    removeView(id)
    setViews(loadSavedViews())
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="保存当前配置为视图"
          allowClear
          size="small"
        />
        <Button icon={<SaveOutlined />} type="primary" size="small" onClick={handleSave}>
          保存
        </Button>
      </Space.Compact>

      <List
        size="small"
        dataSource={views}
        locale={{ emptyText: '暂无保存的视图' }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                key="apply"
                type="link"
                size="small"
                icon={<RocketOutlined />}
                onClick={() => onApply(item)}
              >
                应用
              </Button>,
              <Popconfirm
                key="delete"
                title="删除视图?"
                onConfirm={() => handleRemove(item.id)}
                okText="删除"
                cancelText="取消"
              >
                <Button type="link" size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={
                <Space size="small">
                  <span>{item.name}</span>
                  <Tag>{item.chartType}</Tag>
                </Space>
              }
              description={
                <Space size="small" wrap>
                  {item.metrics.map((m) => (
                    <Tag key={m} color="blue">
                      {m}
                    </Tag>
                  ))}
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default SavedViews

