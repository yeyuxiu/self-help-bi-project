import { useState } from 'react'
import { Card, Button, Space, message, Modal, Form, Input, Select } from 'antd'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PlusOutlined } from '@ant-design/icons'
import { metrics, mockData, ChartConfig, chartTypeOptions, DataPoint } from '@/Data/mockData'
import styles from './index.less'
import SortableItem from './components/SortableItem'
import { ChartItem } from './types'
import { DEFAULT_CHART_ITEMS } from './constants'

const Board = () => {
  const [chartItems, setChartItems] = useState<ChartItem[]>(DEFAULT_CHART_ITEMS)
  const [filteredData] = useState<DataPoint[]>(mockData)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingItem, setEditingItem] = useState<ChartItem | null>(null)
  const [form] = Form.useForm()
  const [linkedData, setLinkedData] = useState<DataPoint[] | undefined>(undefined)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setChartItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleDelete = (id: string) => {
    setChartItems((items) => items.filter((item) => item.id !== id))
    message.success('图表已删除')
  }

  const handleAddChart = () => {
    const newItem: ChartItem = {
      id: Date.now().toString(),
      metricIds: ['1'],
      chartType: 'line',
      title: `图表 ${chartItems.length + 1}`,
    }
    setChartItems([...chartItems, newItem])
    setEditingItem(newItem)
    form.setFieldsValue({
      title: newItem.title,
      chartType: newItem.chartType,
      metricIds: newItem.metricIds,
    })
    setEditModalVisible(true)
  }

  const handleEdit = (item: ChartItem) => {
    setEditingItem(item)
    form.setFieldsValue({
      title: item.title,
      chartType: item.chartType,
      metricIds: item.metricIds,
    })
    setEditModalVisible(true)
  }

  const handleSaveEdit = () => {
    form.validateFields().then((values) => {
      if (editingItem) {
        setChartItems((items) => items.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item)))
        setEditModalVisible(false)
        setEditingItem(null)
        message.success('图表已更新')
      }
    })
  }

  const handleConfigChange = (id: string, config: ChartConfig) => {
    setChartItems((items) => items.map((item) => (item.id === id ? { ...item, config } : item)))
  }

  const handleChartClick = (params: any) => {
    if (params.data && params.dataIndex !== undefined) {
      const clickedDate = filteredData[params.dataIndex]?.date
      if (clickedDate) {
        const linked = filteredData.filter((item) => item.date === clickedDate)
        setLinkedData(linked.length > 0 ? linked : undefined)
        message.info(`已联动筛选：${clickedDate}`)
      }
    }
  }

  const handleClearLink = () => {
    setLinkedData(undefined)
    message.info('已清除联动')
  }

  return (
    <div className={styles.board}>
      <div className={styles.header}>
        <h2>数据看板</h2>
        <Space>
          {linkedData && <Button onClick={handleClearLink}>清除联动</Button>}
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddChart}>
            添加图表
          </Button>
        </Space>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={chartItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className={styles.chartGrid}>
            {chartItems.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                data={filteredData}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onConfigChange={handleConfigChange}
                linkedData={linkedData}
                onChartClick={handleChartClick}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {chartItems.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>暂无图表，点击"添加图表"开始创建</p>
          </div>
        </Card>
      )}

      <Modal
        title="编辑图表"
        open={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => {
          setEditModalVisible(false)
          setEditingItem(null)
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="图表标题" name="title" rules={[{ required: true, message: '请输入图表标题' }]}>
            <Input placeholder="请输入图表标题" />
          </Form.Item>
          <Form.Item label="图表类型" name="chartType" rules={[{ required: true, message: '请选择图表类型' }]}>
            <Select options={chartTypeOptions} />
          </Form.Item>
          <Form.Item label="选择指标" name="metricIds" rules={[{ required: true, message: '请选择至少一个指标' }]}>
            <Select
              mode="multiple"
              options={metrics.map((m: { id: string; name: string; unit?: string }) => ({
                label: `${m.name} (${m.unit || ''})`,
                value: m.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Board
