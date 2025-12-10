import { Layout as AntLayout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  BarChartOutlined,
  FileTextOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from './index.less';

const { Header, Content, Sider } = AntLayout;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: '/custom-template',
      icon: <DashboardOutlined />,
      label: '自定义模板',
    },
    {
      key: '/metric-portal',
      icon: <BarChartOutlined />,
      label: '指标门户',
    },
    {
      key: '/report-template',
      icon: <FileTextOutlined />,
      label: '报表模板',
    },
    {
      key: '/board',
      icon: <AppstoreOutlined />,
      label: '数据看板',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <AntLayout className={styles.layout}>
      <Sider width={200} className={styles.sider}>
        <div className={styles.logo}>自助BI</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className={styles.menu}
        />
      </Sider>
      <AntLayout>
        <Header className={styles.header}>
          <h2>轻量级自助BI系统</h2>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;

