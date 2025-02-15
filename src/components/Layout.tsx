import React from "react";
import {
  Layout as AntLayout,
  Menu,
  Input,
  Button,
  Dropdown,
  Space,
  Badge,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Outlet } from "react-router-dom";

const { Header, Content, Footer } = AntLayout;
const { Search } = Input;

// 分类下拉菜单项
const categoryItems: MenuProps["items"] = [
  {
    key: "1",
    label: "分类1",
  },
  {
    key: "2",
    label: "分类2",
  },
  {
    key: "3",
    label: "分类3",
  },
];

const Layout = () => {
  return (
    <AntLayout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Dropdown menu={{ items: categoryItems }}>
            <Button type="link">分类</Button>
          </Dropdown>
          <Button type="link">About</Button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Search
            placeholder="搜索..."
            enterButton={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<UserOutlined />}>
            登录
          </Button>
          <Badge count={0}>
            <ShoppingCartOutlined
              style={{ fontSize: "24px", cursor: "pointer" }}
            />
          </Badge>
        </div>
      </Header>

      <Content style={{ padding: "0 50px", minHeight: "calc(100vh - 134px)" }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: "center", background: "#fff" }}>
        © 2025 Doutok Team
      </Footer>
    </AntLayout>
  );
};

export default Layout;
