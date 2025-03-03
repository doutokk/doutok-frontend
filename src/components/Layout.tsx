import { Layout as AntLayout, Menu, Input, Button, Badge, Dropdown } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  PictureOutlined, // Add this import for the image icon
  ShopOutlined, // Add this import for the shop icon
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Outlet } from "react-router-dom";
import LogoImage from "../assets/doutok_shop2.png"; // 添加这一行
import { hasRole } from "../services/auth"; // Import hasRole function

const { Header, Content, Footer } = AntLayout;
const { Search } = Input;

// 分类下拉菜单项
const categoryItems: MenuProps["items"] = [
  {
    key: "sticker",
    label: "贴纸",
  },
  {
    key: "t-shirt",
    label: "T恤",
  },
  {
    key: "coffee",
    label: "咖啡",
  },
];

// 导航菜单项
const menuItems: MenuProps["items"] = [
  {
    key: "/category",
    label: "分类",
    children: categoryItems?.map(
      (item) =>
        item && {
          ...item,
          key: `/category/${item.key}`,
        }
    ),
  },
  {
    key: "/about",
    label: "关于",
  },
];

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token") !== null;
  const isAdmin = hasRole("admin"); // Check if user has admin role

  // 从 URL 中获取搜索参数
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const baseUserMenuItems = [
    {
      key: "orders",
      label: "订单",
      icon: <OrderedListOutlined />,
      onClick: () => navigate("/orders"),
    },
  ];
  
  // Add admin-only menu items if user has admin role
  const adminMenuItems = isAdmin 
    ? [
        {
          key: "imagehosting",
          label: "图床",
          icon: <PictureOutlined />,
          onClick: () => navigate("/imagehosting"),
        },
        {
          key: "create-product",
          label: "创建商品",
          icon: <ShopOutlined />,
          onClick: () => navigate("/create-product"),
        },
      ] 
    : [];
  
  const logoutMenuItem = [
    {
      key: "logout",
      label: "登出",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const userMenuItems: MenuProps["items"] = [
    ...baseUserMenuItems,
    ...adminMenuItems,
    ...logoutMenuItem,
  ];

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
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                marginRight: "32px",
              }}
              onClick={() => navigate("/")}
            >
              <img
                src={LogoImage}
                alt="Doutok Shop Logo"
                style={{
                  height: "40px",
                  marginRight: "8px",
                }}
              />
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                Doutok Shop
              </span>
            </div>
            <Menu
              mode="horizontal"
              items={menuItems}
              onClick={handleMenuClick}
              style={{
                border: "none",
                flex: 1,
                minWidth: "200px",
                backgroundColor: "transparent",
                fontSize: "16px",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Search
              placeholder="搜索..."
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 300 }}
              defaultValue={searchQuery}
            />
            {isLoggedIn ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <UserOutlined
                  style={{ fontSize: "24px", cursor: "pointer" }}
                />
              </Dropdown>
            ) : (
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={handleLoginClick}
                style={{ fontWeight: "bold" }}
              >
                登录
              </Button>
            )}
            <Badge count={0} onClick={handleCartClick}>
              <ShoppingCartOutlined
                style={{ fontSize: "24px", cursor: "pointer" }}
              />
            </Badge>
          </div>
        </div>
      </Header>

      <Content
        style={{
          padding: "0 50px",
          minHeight: "calc(100vh - 134px)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1200px" }}>
          <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: "center", background: "#fff" }}>
        © 2025 Doutok Team
        <p>本网站为示例项目，不是真实的商城</p>
        <p>所有素材来源网络</p>
      </Footer>
    </AntLayout>
  );
};

export default Layout;
