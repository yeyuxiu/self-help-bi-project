import { mockData, metrics, DataPoint, Metric } from '@/Data/mockData';
import type { AggregateType } from '@/Data/mockData';
import { groupByData, aggregateByTime } from '@/Utils/dataAggregation';

// API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 请求配置
export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  data?: Record<string, any>;
  timeout?: number;
}

// 模拟延迟
const delay = (ms: number = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// 统一请求函数
export const request = async <T = any>(config: RequestConfig): Promise<ApiResponse<T>> => {
  const { url, method = 'GET', params, data, timeout = 800 } = config;
  
  // 模拟网络延迟
  await delay(timeout);

  try {
    // 根据不同的 URL 返回不同的数据
    if (url === '/api/metrics') {
      return {
        code: 200,
        message: 'success',
        success: true,
        data: metrics as T,
      };
    }

    if (url === '/api/data') {
      let result = [...mockData];
      
      // 处理筛选参数
      if (params?.filters) {
        const filters = params.filters;
        result = result.filter((item) => {
          if (filters.dateRange && filters.dateRange.length === 2) {
            const [start, end] = filters.dateRange;
            if (item.date < start || item.date > end) {
              return false;
            }
          }
          if (filters.region && item.region !== filters.region) {
            return false;
          }
          if (filters.category && item.category !== filters.category) {
            return false;
          }
          return true;
        });
      }

      // 处理聚合参数
      if (params?.aggregation) {
        const { type, dimension, metric, func, timePeriod } = params.aggregation;
        if (type === 'dimension' && dimension && metric && func) {
          result = groupByData(result, {
            dimension,
            aggregate: [{ metric, func }],
          });
        } else if (type === 'time' && metric && timePeriod && func) {
          result = aggregateByTime(result, timePeriod, metric, func);
        }
      }

      return {
        code: 200,
        message: 'success',
        success: true,
        data: result as T,
      };
    }

    if (url === '/api/dashboard/kpi') {
      // 计算 KPI 数据
      const totalSales = mockData.reduce((sum, item) => sum + (item.sales as number), 0);
      const totalOrders = mockData.reduce((sum, item) => sum + (item.orders as number), 0);
      const totalUsers = mockData.reduce((sum, item) => sum + (item.users as number), 0);
      const avgConversion = mockData.reduce((sum, item) => sum + (item.conversion as number), 0) / mockData.length;
      
      // 计算趋势（对比前一天）
      const today = mockData[mockData.length - 1];
      const yesterday = mockData[mockData.length - 2] || today;
      
      const salesTrend = today.sales > yesterday.sales ? 'up' : 'down';
      const ordersTrend = today.orders > yesterday.orders ? 'up' : 'down';
      const usersTrend = today.users > yesterday.users ? 'up' : 'down';
      const conversionTrend = today.conversion > yesterday.conversion ? 'up' : 'down';

      return {
        code: 200,
        message: 'success',
        success: true,
        data: {
          totalSales,
          totalOrders,
          totalUsers,
          avgConversion: Number(avgConversion.toFixed(2)),
          salesTrend,
          ordersTrend,
          usersTrend,
          conversionTrend,
          salesChange: Number(((today.sales as number) - (yesterday.sales as number)).toFixed(2)),
          ordersChange: (today.orders as number) - (yesterday.orders as number),
          usersChange: (today.users as number) - (yesterday.users as number),
          conversionChange: Number(((today.conversion as number) - (yesterday.conversion as number)).toFixed(2)),
        } as T,
      };
    }

    if (url === '/api/dashboard/charts') {
      // 返回图表数据
      const chartData = {
        salesTrend: mockData.map((item) => ({
          date: item.date,
          value: item.sales,
        })),
        ordersTrend: mockData.map((item) => ({
          date: item.date,
          value: item.orders,
        })),
        regionDistribution: mockData.reduce((acc, item) => {
          const region = item.region as string;
          if (!acc[region]) {
            acc[region] = 0;
          }
          acc[region] += item.sales as number;
          return acc;
        }, {} as Record<string, number>),
        categoryDistribution: mockData.reduce((acc, item) => {
          const category = item.category as string;
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += item.orders as number;
          return acc;
        }, {} as Record<string, number>),
      };

      return {
        code: 200,
        message: 'success',
        success: true,
        data: chartData as T,
      };
    }

    // 默认返回
    return {
      code: 200,
      message: 'success',
      success: true,
      data: {} as T,
    };
  } catch (error) {
    return {
      code: 500,
      message: error instanceof Error ? error.message : '请求失败',
      success: false,
      data: {} as T,
    };
  }
};

// GET 请求
export const get = <T = any>(url: string, params?: Record<string, any>, timeout?: number) => {
  return request<T>({ url, method: 'GET', params, timeout });
};

// POST 请求
export const post = <T = any>(url: string, data?: Record<string, any>, timeout?: number) => {
  return request<T>({ url, method: 'POST', data, timeout });
};

