import { DataPoint, Metric } from '@/Data/mockData';

// 导出CSV
export const exportToCSV = (data: DataPoint[], metrics: Metric[], filename = 'data') => {
  if (data.length === 0) return;

  const headers = ['日期', ...metrics.map((m) => `${m.name}(${m.unit || ''})`)];
  const rows = data.map((item) => {
    const date = item.date;
    const values = metrics.map((metric) => {
      const value = item[metric.code];
      if (metric.type === 'currency') {
        return `¥${value}`;
      }
      if (metric.type === 'percent') {
        return `${value}%`;
      }
      return value;
    });
    return [date, ...values];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 导出Excel (简单实现，实际项目中可以使用 xlsx 库)
export const exportToExcel = (data: DataPoint[], metrics: Metric[], filename = 'data') => {
  // 这里简化处理，实际可以使用 xlsx 库
  exportToCSV(data, metrics, filename);
};

