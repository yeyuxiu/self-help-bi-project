import { useState } from 'react';
import { Drawer, Form, Input, Switch, InputNumber, Select, Button, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { ChartConfig, ChartType, defaultTheme } from '@/Data/mockData';
import styles from './index.less';

interface ChartConfigPanelProps {
  chartType: ChartType;
  config: ChartConfig;
  onConfigChange: (config: ChartConfig) => void;
  trigger?: React.ReactNode;
}

const ChartConfigPanel = ({
  chartType,
  config,
  onConfigChange,
  trigger,
}: ChartConfigPanelProps) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleOpen = () => {
    form.setFieldsValue({
      title: config.title || '',
      showLegend: config.showLegend !== false,
      showTooltip: config.showTooltip !== false,
      height: config.height || 400,
      smooth: config.smooth || false,
      stack: config.stack || false,
      radius: config.radius || '50%',
      colors: config.colors || defaultTheme.color,
    });
    setOpen(true);
  };

  const handleSave = () => {
    const values = form.getFieldsValue();
    onConfigChange({
      ...config,
      ...values,
    });
    setOpen(false);
  };

  return (
    <>
      {trigger ? (
        <span onClick={handleOpen}>{trigger}</span>
      ) : (
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={handleOpen}
          className={styles.configBtn}
        >
          配置
        </Button>
      )}
      <Drawer
        title="图表配置"
        open={open}
        onClose={() => setOpen(false)}
        width={400}
        extra={
          <Space>
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item label="图表标题" name="title">
            <Input placeholder="请输入图表标题" />
          </Form.Item>

          <Form.Item label="图表高度" name="height">
            <InputNumber min={200} max={800} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="显示图例" name="showLegend" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="显示提示框" name="showTooltip" valuePropName="checked">
            <Switch />
          </Form.Item>

          {(chartType === 'line' || chartType === 'area') && (
            <>
              <Form.Item label="平滑曲线" name="smooth" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="堆叠" name="stack" valuePropName="checked">
                <Switch />
              </Form.Item>
            </>
          )}

          {chartType === 'pie' && (
            <Form.Item label="半径" name="radius">
              <Select
                options={[
                  { label: '50%', value: '50%' },
                  { label: '60%', value: '60%' },
                  { label: '70%', value: '70%' },
                  { label: '80%', value: '80%' },
                  { label: '90%', value: '90%' },
                ]}
              />
            </Form.Item>
          )}

          <Form.Item label="颜色配置">
            <Space direction="vertical" style={{ width: '100%' }}>
              {defaultTheme.color.map((color, index) => (
                <Space key={index}>
                  <Input
                    type="color"
                    value={config.colors?.[index] || color}
                    onChange={(e) => {
                      const newColors = [...(config.colors || defaultTheme.color)];
                      newColors[index] = e.target.value;
                      form.setFieldsValue({ colors: newColors });
                    }}
                    style={{ width: 60, height: 32 }}
                  />
                  <span>颜色 {index + 1}</span>
                  <Input
                    value={config.colors?.[index] || color}
                    onChange={(e) => {
                      const newColors = [...(config.colors || defaultTheme.color)];
                      newColors[index] = e.target.value;
                      form.setFieldsValue({ colors: newColors });
                    }}
                    style={{ width: 100 }}
                    placeholder="十六进制颜色"
                  />
                </Space>
              ))}
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default ChartConfigPanel;

