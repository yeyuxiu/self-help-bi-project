import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/Layout';
import Dashboard from '@/Dashboard';
import MetricPortal from '@/MetricPortal';
import ReportTemplate from '@/ReportTemplate';
import Board from '@/Board';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/custom-template" replace />} />
          <Route path="custom-template" element={<Dashboard />} />
          <Route path="dashboard" element={<Navigate to="/custom-template" replace />} />
          <Route path="metric-portal" element={<MetricPortal />} />
          <Route path="report-template" element={<ReportTemplate />} />
          <Route path="board" element={<Board />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

