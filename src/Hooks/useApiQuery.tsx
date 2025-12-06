import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { request, ApiResponse } from '@/Services/api';
import { Metric, DataPoint, AggregateType } from '@/Data/mockData';
import { Spin } from 'antd';

// 统一请求 Hook 配置
export interface UseApiQueryOptions<T = any> extends Omit<UseQueryOptions<ApiResponse<T>>, 'queryFn' | 'queryKey'> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  data?: Record<string, any>;
  timeout?: number;
  enabled?: boolean;
  // 是否自动处理 loading（显示 Spin）
  showLoading?: boolean;
}

// 统一请求 Hook
export const useApiQuery = <T = any>(
  options: UseApiQueryOptions<T>
): UseQueryResult<ApiResponse<T>, Error> => {
  const {
    url,
    method = 'GET',
    params,
    data,
    timeout = 800,
    enabled = true,
    showLoading = false,
    ...queryOptions
  } = options;

  const queryKey = [url, method, params, data];

  const queryResult = useQuery<ApiResponse<T>, Error>({
    queryKey,
    queryFn: async () => {
      return await request<T>({
        url,
        method,
        params,
        data,
        timeout,
      });
    },
    enabled,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5分钟
    ...queryOptions,
  });

  return queryResult;
};

// 带 Loading 的请求 Hook
export const useApiQueryWithLoading = <T = any>(
  options: UseApiQueryOptions<T>
) => {
  const queryResult = useApiQuery<T>({
    ...options,
    showLoading: true,
  });

  return {
    ...queryResult,
    LoadingWrapper: ({ children }: { children: React.ReactNode }) =>
      queryResult.isLoading ? <Spin /> : <>{children}</>,
  };
};
export const useMetrics = () => {
  return useApiQuery<Metric[]>({
    url: '/api/metrics',
    showLoading: false,
  });
};

// 获取数据列表
export const useData = (params?: {
  filters?: Record<string, any>;
  aggregation?: {
    type: 'dimension' | 'time';
    dimension?: string;
    metric?: string;
    func?: AggregateType;
    timePeriod?: 'day' | 'week' | 'month';
  };
}) => {
  return useApiQuery<DataPoint[]>({
    url: '/api/data',
    params,
    showLoading: true,
  });
};

// 获取 KPI 数据
export const useKpiData = () => {
  return useApiQuery<{
    totalSales: number;
    totalOrders: number;
    totalUsers: number;
    avgConversion: number;
    salesTrend: 'up' | 'down';
    ordersTrend: 'up' | 'down';
    usersTrend: 'up' | 'down';
    conversionTrend: 'up' | 'down';
    salesChange: number;
    ordersChange: number;
    usersChange: number;
    conversionChange: number;
  }>({
    url: '/api/dashboard/kpi',
    showLoading: true,
    refetchInterval: 30 * 1000, // 30秒自动刷新
  });
};

// 获取图表数据
export const useChartData = () => {
  return useApiQuery<{
    salesTrend: Array<{ date: string; value: number }>;
    ordersTrend: Array<{ date: string; value: number }>;
    regionDistribution: Record<string, number>;
    categoryDistribution: Record<string, number>;
  }>({
    url: '/api/dashboard/charts',
    showLoading: true,
  });
};

