import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Layout as AntLayout, Menu, Input } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = AntLayout;

const Layout = () => {
  return (
    <AntLayout style={{ minHeight: "100vh", minWidth: 1200 }}>
      <Header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <div style={{ flexShrink: 0 }}>
          <Menu mode="horizontal" style={{ borderBottom: "none" }} selectedKeys={[]}>
            <Menu.SubMenu key="sub1" title="分类">
              <Menu.Item key="1">分类1</Menu.Item>
              <Menu.Item key="2">分类2</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="about">
              <Link to="/about">about</Link>
            </Menu.Item>
          </Menu>
        </div>
        <div>
          <Input.Search
            placeholder="搜索"
            style={{ width: 200 }}
            onSearch={(value) => console.log(value)}
          />
        </div>
        <div style={{ flexShrink: 0 }}>
          <Menu mode="horizontal" style={{ borderBottom: "none" }} selectedKeys={[]}>
            <Menu.Item key="login">登录</Menu.Item>
            <Menu.Item key="cart" icon={<ShoppingCartOutlined />} />
          </Menu>
        </div>
      </Header>
      <Content style={{ padding: "0 50px", marginTop: 24 }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: "center" }}>© 2025 Doutok Team</Footer>
    </AntLayout>
  );
};

export default Layout;
