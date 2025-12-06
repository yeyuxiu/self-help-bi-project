import { DataPoint, AggregateType } from '@/Data/mockData';

// 数据聚合工具
export interface GroupByConfig {
  dimension: string; // 分组维度
  aggregate: {
    metric: string; // 聚合指标
    func: AggregateType; // 聚合函数
  }[];
}

// 分组聚合数据
export const groupByData = (
  data: DataPoint[],
  config: GroupByConfig
): DataPoint[] => {
  const { dimension, aggregate } = config;
  const groups = new Map<string, DataPoint[]>();

  // 按维度分组
  data.forEach((item) => {
    const key = item[dimension] as string;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  });

  // 对每组进行聚合
  const result: DataPoint[] = [];
  groups.forEach((groupData, key) => {
    const aggregated: DataPoint = {
      [dimension]: key,
    } as DataPoint;

    aggregate.forEach(({ metric, func }) => {
      const values = groupData.map((item) => item[metric] as number).filter((v) => v != null);
      
      switch (func) {
        case 'sum':
          aggregated[metric] = values.reduce((a, b) => a + b, 0);
          break;
        case 'avg':
          aggregated[metric] = values.length > 0 
            ? values.reduce((a, b) => a + b, 0) / values.length 
            : 0;
          break;
        case 'max':
          aggregated[metric] = values.length > 0 ? Math.max(...values) : 0;
          break;
        case 'min':
          aggregated[metric] = values.length > 0 ? Math.min(...values) : 0;
          break;
        case 'count':
          aggregated[metric] = values.length;
          break;
      }
    });

    result.push(aggregated);
  });

  return result;
};

// 时间聚合（按天/周/月）
export const aggregateByTime = (
  data: DataPoint[],
  period: 'day' | 'week' | 'month',
  metric: string,
  func: AggregateType = 'sum'
): DataPoint[] => {
  const groups = new Map<string, DataPoint[]>();

  data.forEach((item) => {
    const date = new Date(item.date);
    let key: string;
    
    if (period === 'day') {
      key = item.date;
    } else if (period === 'week') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split('T')[0];
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  });

  const result: DataPoint[] = [];
  groups.forEach((groupData, key) => {
    const values = groupData.map((item) => item[metric] as number).filter((v) => v != null);
    let aggregatedValue = 0;

    switch (func) {
      case 'sum':
        aggregatedValue = values.reduce((a, b) => a + b, 0);
        break;
      case 'avg':
        aggregatedValue = values.length > 0 
          ? values.reduce((a, b) => a + b, 0) / values.length 
          : 0;
        break;
      case 'max':
        aggregatedValue = values.length > 0 ? Math.max(...values) : 0;
        break;
      case 'min':
        aggregatedValue = values.length > 0 ? Math.min(...values) : 0;
        break;
      case 'count':
        aggregatedValue = values.length;
        break;
    }

    result.push({
      date: key,
      [metric]: aggregatedValue,
    } as DataPoint);
  });

  return result.sort((a, b) => (a.date as string).localeCompare(b.date as string));
};

