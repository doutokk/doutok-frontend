import {
  Layout as AntLayout,
  Menu,
  Input,
  Button,
  Badge,
} from "antd";
import { useNavigate } from "react-router-dom";
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

// 导航菜单项
const menuItems: MenuProps["items"] = [
  {
    key: "/",
    label: "首页",
  },
  {
    key: "/category",
    label: "分类",
    children: categoryItems.map(item => ({
      ...item,
      key: `/category/${item.key}`
    })),
  },
  {
    key: "/about",
    label: "关于",
  },
];

const Layout = () => {
  const navigate = useNavigate();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleSearch = (value: string) => {
    navigate(`/search?q=${value}`);
  };

  return (
    <AntLayout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          padding: 0,
        }}
      >
        <div style={{ 
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <Menu
            mode="horizontal"
            items={menuItems}
            onClick={handleMenuClick}
            style={{
              border: "none",
              flex: 1,
              minWidth: "400px",
              backgroundColor: "transparent",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Search
              placeholder="搜索..."
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={handleLoginClick}
              style={{ fontWeight: "bold" }}
            >
              登录
            </Button>
            <Badge count={0} onClick={handleCartClick}>
              <ShoppingCartOutlined
                style={{ fontSize: "24px", cursor: "pointer" }}
              />
            </Badge>
          </div>
        </div>
      </Header>

      <Content style={{ 
        padding: "0 50px", 
        minHeight: "calc(100vh - 134px)",
        display: "flex",
        justifyContent: "center",
      }}>
        <div style={{ width: "100%", maxWidth: "1200px" }}>
          <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: "center", background: "#fff" }}>
        © 2025 Doutok Team
      </Footer>
    </AntLayout>
  );
};

export default Layout;
