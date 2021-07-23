import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
import './Sidebar.css';
import {
  DesktopOutlined,
  PieChartOutlined,
  WechatOutlined,
  SettingOutlined,
  AreaChartOutlined,
  NodeExpandOutlined,
  PartitionOutlined,
  PullRequestOutlined,
  WalletOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapsed = () => {
    setIsCollapsed(true);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<WalletOutlined />}>
            Wallet
          </Menu.Item>
          <Menu.Item key="2" icon={<PartitionOutlined />}>
            P2P
          </Menu.Item>
          <Menu.Item key="2" icon={<PullRequestOutlined />}>
            Transactions
          </Menu.Item>
          <Menu.Item key="2" icon={<NodeExpandOutlined />}>
            Trade Now
          </Menu.Item>
          <Menu.Item key="2" icon={<AreaChartOutlined />}>
            Rates
          </Menu.Item>
          <Menu.Item key="2" icon={<WechatOutlined />}>
            Chat
          </Menu.Item>
          <Menu.Item key="2" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
          {/* <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />}>
            Files
          </Menu.Item> */}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            Bill is a cat.
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Built ©2021 All rights Early Baze Wallet
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Sidebar;
