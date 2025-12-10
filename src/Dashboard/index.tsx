import { useState, useEffect } from 'react'
import { message } from 'antd'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { useKpiData } from '@/Hooks/useApiQuery'
import { TemplateComponent } from './type'
import ComponentLibrary from './components/ComponentLibrary'
import CanvasArea from './components/CanvasArea'
import EditComponentModal from './components/EditComponentModal'
import SaveTemplateModal from './components/SaveTemplateModal'
import DragPreview from './components/DragPreview'
import DashboardHeader from './components/DashboardHeader'
import { useDragHandler } from './hooks/useDragHandler'
import {
  saveTemplateToStorage,
  loadTemplateFromStorage,
} from './utils/template'
import { getActiveComponentPreview } from './utils/preview'
import styles from './index.less'

const Dashboard = () => {
  const { data: kpiData } = useKpiData()

  const [components, setComponents] = useState<TemplateComponent[]>([])
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingComponent, setEditingComponent] =
    useState<TemplateComponent | null>(null)
  const [saveModalVisible, setSaveModalVisible] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  // 加载保存的模板
  useEffect(() => {
    const savedComponents = loadTemplateFromStorage()
    if (savedComponents.length > 0) {
      setComponents(savedComponents)
    }
  }, [])

  const { activeId, handleDragStart, handleDragEnd } = useDragHandler({
    components,
    setComponents,
  })

  // 删除组件
  const handleDelete = (id: string) => {
    setComponents(components.filter((c) => c.id !== id))
    message.success('已删除组件')
  }

  // 编辑组件
  const handleEdit = (component: TemplateComponent) => {
    setEditingComponent(component)
    setEditModalVisible(true)
  }

  // 保存编辑
  const handleSaveEdit = (values: any) => {
    if (editingComponent) {
      setComponents(
        components.map((c) =>
          c.id === editingComponent.id ? { ...c, ...values } : c
        )
      )
      setEditModalVisible(false)
      setEditingComponent(null)
      message.success('组件已更新')
    }
  }

  // 配置变更
  const handleConfigChange = (id: string, config: any) => {
    setComponents(
      components.map((c) =>
        c.id === id && c.type === 'chart' ? { ...c, config } : c
      )
    )
  }

  // 保存模板
  const handleSaveTemplate = (name: string) => {
    saveTemplateToStorage(name, components)
    setSaveModalVisible(false)
  }

  // 清空画布
  const handleClear = () => {
    setComponents([])
    message.success('已清空画布')
  }

  // 获取当前拖拽的组件预览
  const previewData = getActiveComponentPreview(activeId, components)

  return (
    <div className={styles.dashboard}>
      <DashboardHeader
        componentsCount={components.length}
        onClear={handleClear}
        onSave={() => setSaveModalVisible(true)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.content}>
          <ComponentLibrary />
          <CanvasArea
            components={components}
            kpiData={kpiData}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onConfigChange={handleConfigChange}
          />
        </div>

        <DragOverlay>
          {previewData && (
            <DragPreview icon={previewData.icon} text={previewData.text} />
          )}
        </DragOverlay>
      </DndContext>

      <EditComponentModal
        visible={editModalVisible}
        component={editingComponent}
        onOk={handleSaveEdit}
        onCancel={() => {
          setEditModalVisible(false)
          setEditingComponent(null)
        }}
      />

      <SaveTemplateModal
        visible={saveModalVisible}
        components={components}
        onOk={handleSaveTemplate}
        onCancel={() => setSaveModalVisible(false)}
      />
    </div>
  )
}

export default Dashboard
