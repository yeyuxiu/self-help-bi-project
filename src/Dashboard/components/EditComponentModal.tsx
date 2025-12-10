import { useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { TemplateComponent } from '../type'
import { KPI_METRICS, SPAN_OPTIONS, chartTypeOptions } from '../constants'
import { metrics } from '@/Data/mockData'

interface EditComponentModalProps {
  visible: boolean
  component: TemplateComponent | null
  onOk: (values: any) => void
  onCancel: () => void
}

const EditComponentModal = ({
  visible,
  component,
  onOk,
  onCancel,
}: EditComponentModalProps) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible && component) {
      form.setFieldsValue({
        title: component.title,
        span: component.span,
        ...(component.type === 'kpi'
          ? { metricId: component.metricId }
          : {
              chartType: component.chartType,
              metricIds: component.metricIds,
            }),
      })
    } else if (!visible) {
      form.resetFields()
    }
  }, [visible, component, form])

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values)
    })
  }

  return (
    <Modal
      title="编辑组件"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="组件标题"
          name="title"
          rules={[{ required: true, message: '请输入组件标题' }]}
        >
          <Input placeholder="请输入组件标题" />
        </Form.Item>
        <Form.Item
          label="栅格宽度"
          name="span"
          rules={[{ required: true, message: '请选择栅格宽度' }]}
        >
          <Select options={SPAN_OPTIONS} />
        </Form.Item>
        {component?.type === 'kpi' && (
          <Form.Item
            label="选择指标"
            name="metricId"
            rules={[{ required: true, message: '请选择指标' }]}
          >
            <Select
              options={KPI_METRICS.map((metric) => ({
                label: metric.name,
                value: metric.id,
              }))}
            />
          </Form.Item>
        )}
        {component?.type === 'chart' && (
          <>
            <Form.Item
              label="图表类型"
              name="chartType"
              rules={[{ required: true, message: '请选择图表类型' }]}
            >
              <Select options={chartTypeOptions} />
            </Form.Item>
            <Form.Item
              label="选择指标"
              name="metricIds"
              rules={[{ required: true, message: '请选择至少一个指标' }]}
            >
              <Select
                mode="multiple"
                options={metrics.map((m: any) => ({
                  label: `${m.name} (${m.unit || ''})`,
                  value: m.id,
                }))}
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
}

export default EditComponentModal

