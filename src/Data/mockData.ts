// 模拟数据模型
export interface Metric {
  id: string;
  name: string;
  code: string;
  type: 'number' | 'percent' | 'currency';
  unit?: string;
}

export interface Dimension {
  id: string;
  name: string;
  code: string;
  type: 'category' | 'date';
  values?: string[];
}

export interface DataPoint {
  date: string;
  region?: string;
  product?: string;
  category?: string;
  [key: string]: string | number | undefined;
}

// 指标定义
export const metrics: Metric[] = [
  { id: '1', name: '销售额', code: 'sales', type: 'currency', unit: '元' },
  { id: '2', name: '订单数', code: 'orders', type: 'number', unit: '单' },
  { id: '3', name: '用户数', code: 'users', type: 'number', unit: '人' },
  { id: '4', name: '转化率', code: 'conversion', type: 'percent', unit: '%' },
  { id: '5', name: '客单价', code: 'avg_price', type: 'currency', unit: '元' },
  { id: '6', name: '访问量', code: 'visits', type: 'number', unit: '次' },
  { id: '7', name: '退款金额', code: 'refund', type: 'currency', unit: '元' },
  { id: '8', name: '好评率', code: 'rating', type: 'percent', unit: '%' },
];

// 维度定义
export const dimensions: Dimension[] = [
  { id: '1', name: '地区', code: 'region', type: 'category', values: ['华东', '华南', '华北', '西南', '西北', '东北'] },
  { id: '2', name: '产品类别', code: 'category', type: 'category', values: ['电子产品', '服装', '食品', '家居', '图书'] },
  { id: '3', name: '产品', code: 'product', type: 'category', values: ['iPhone', 'MacBook', 'iPad', 'AirPods', 'Watch'] },
];

// 模拟数据（增加维度）
export const mockData: DataPoint[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (89 - i));
  const regions = ['华东', '华南', '华北', '西南', '西北', '东北'];
  const categories = ['电子产品', '服装', '食品', '家居', '图书'];
  const products = ['iPhone', 'MacBook', 'iPad', 'AirPods', 'Watch'];
  
  return {
    date: date.toISOString().split('T')[0],
    region: regions[Math.floor(Math.random() * regions.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    product: products[Math.floor(Math.random() * products.length)],
    sales: Math.floor(Math.random() * 100000) + 50000,
    orders: Math.floor(Math.random() * 500) + 200,
    users: Math.floor(Math.random() * 1000) + 500,
    conversion: Number((Math.random() * 5 + 5).toFixed(2)),
    avg_price: Math.floor(Math.random() * 200) + 100,
    visits: Math.floor(Math.random() * 5000) + 2000,
    refund: Math.floor(Math.random() * 5000),
    rating: Number((Math.random() * 20 + 80).toFixed(2)),
  };
});

// 图表类型（扩展）
export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'area' 
  | 'scatter' 
  | 'radar' 
  | 'heatmap' 
  | 'bubble'
  | 'funnel'
  | 'gauge'
  | 'treemap'
  | 'sankey';

// 聚合函数类型
export type AggregateType = 'sum' | 'avg' | 'max' | 'min' | 'count';

// 图表配置
export interface ChartConfig {
  title?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  colors?: string[];
  height?: number;
  smooth?: boolean;
  stack?: boolean;
  radius?: number | string; // 饼图半径
}

// 图表主题
export interface ChartTheme {
  color: string[];
  backgroundColor: string;
}

export const defaultTheme: ChartTheme = {
  color: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'],
  backgroundColor: '#fff',
};

// 图表类型选项
export const chartTypeOptions = [
  { label: '折线图', value: 'line', icon: '📈' },
  { label: '柱状图', value: 'bar', icon: '📊' },
  { label: '饼图', value: 'pie', icon: '🥧' },
  { label: '面积图', value: 'area', icon: '📉' },
  { label: '散点图', value: 'scatter', icon: '⚫' },
  { label: '雷达图', value: 'radar', icon: '🕸️' },
  { label: '热力图', value: 'heatmap', icon: '🔥' },
  { label: '气泡图', value: 'bubble', icon: '💭' },
  { label: '漏斗图', value: 'funnel', icon: '🔽' },
  { label: '仪表盘', value: 'gauge', icon: '⏱️' },
  { label: '矩形树图', value: 'treemap', icon: '📦' },
  { label: '桑基图', value: 'sankey', icon: '🌊' },
];

