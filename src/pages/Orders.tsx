import { useEffect, useState } from 'react';
import { List, Card, Typography, Space, Empty } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import http from '../utils/http';

const { Title, Text } = Typography;

interface OrderItem {
  item: {
    product_id: number;
    quantity: number;
  };
}

interface Address {
  street_address: string;
  city: string;
  state: string;
  country: string;
  zip_code: number;
}

interface Order {
  order_id: string;
  user_id: number;
  user_currency: string;
  order_items: OrderItem[];
  address: Address;
  email: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await http.get('/order');
        setOrders(response.data.orders);
      } catch (error) {
        console.error('获取订单列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="py-6 px-4 md:px-6">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingOutlined className="text-xl" />
        <h2 className="text-2xl font-bold m-0">我的订单</h2>
      </div>
      
      {orders.length === 0 && !loading ? (
        <Empty description="暂无订单" />
      ) : (
        <List
          loading={loading}
          dataSource={orders}
          renderItem={(order) => (
            <List.Item className="w-full">
              <Card
                title={
                  <div className="flex flex-wrap gap-4">
                    <Text>订单号: {order.order_id}</Text>
                    <Text>货币: {order.user_currency}</Text>
                  </div>
                }
                className="w-full"
              >
                <List
                  dataSource={order.order_items}
                  renderItem={(orderItem) => (
                    <List.Item className="flex flex-wrap gap-4">
                      <Text>商品ID: {orderItem.item.product_id}</Text>
                      <Text>数量: {orderItem.item.quantity}</Text>
                    </List.Item>
                  )}
                />
                <div className="mt-4 space-y-2">
                  <Text strong className="block">收货地址:</Text>
                  <div className="text-gray-600">
                    <p className="m-0">{order.address.street_address}</p>
                    <p className="m-0">{`${order.address.city}, ${order.address.state}`}</p>
                    <p className="m-0">{`${order.address.country} ${order.address.zip_code}`}</p>
                    <p className="m-0">邮箱: {order.email}</p>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Orders;
