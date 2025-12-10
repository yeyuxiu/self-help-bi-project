import { Modal, Form, Input } from 'antd'
import { TemplateComponent } from '../type'
import styles from '../index.less'

interface SaveTemplateModalProps {
  visible: boolean
  components: TemplateComponent[]
  onOk: (name: string) => void
  onCancel: () => void
}

const SaveTemplateModal = ({
  visible,
  components,
  onOk,
  onCancel,
}: SaveTemplateModalProps) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values.name)
    })
  }

  const kpiCount = components.filter((c) => c.type === 'kpi').length
  const chartCount = components.filter((c) => c.type === 'chart').length

  return (
    <Modal
      title="保存自定义模板"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="模板名称"
          name="name"
          rules={[
            { required: true, message: '请输入模板名称' },
            { max: 50, message: '模板名称不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入模板名称，如：销售数据看板" />
        </Form.Item>
        <div className={styles.templateInfo}>
          <p>当前模板包含：</p>
          <ul>
            <li>KPI 指标：{kpiCount} 个</li>
            <li>图表组件：{chartCount} 个</li>
            <li>总计：{components.length} 个组件</li>
          </ul>
        </div>
      </Form>
    </Modal>
  )
}

export default SaveTemplateModal

