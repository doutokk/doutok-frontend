import { useEffect, useState } from 'react';
import { List, Card, Button, InputNumber, Typography, Space, Empty, message, Badge } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import http from '../utils/http';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface CartItem {
  productId: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  img: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await http.get('/cart');

      setCartItems(response.data.items);
    } catch (error) {
      console.error('获取购物车失败:', error);
      message.error('获取购物车失败');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId: number, quantity: number) => {
    try {
      
      await http.post('/cart/edit', {
        items: [
          {
            product_id: productId,
            quantity: quantity
          }
        ]
      });
      fetchCartItems();
      if (quantity === 0) {
        message.success('商品已移除');
      }
    } catch (error) {
      console.error('更新购物车失败:', error);
      message.error('更新购物车失败');
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    updateCartItem(productId, quantity);
  };

  const removeItem = async (productId: number) => {
    updateCartItem(productId, 0);
  };

  const handleCheckout = async () => {
    try {
      await http.post('/cart/checkout');
      message.success('下单成功');
      navigate('/orders');
    } catch (error) {
      console.error('结算失败:', error);
      message.error('结算失败');
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2}>
        <Space>
          <ShoppingCartOutlined />
          购物车
        </Space>
      </Title>

      {cartItems.length === 0 && !loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Empty description="购物车是空的" />
        </div>
      ) : (
        <>
          <List
            loading={loading}
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item>
                <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <Space size="large" align="start" className="flex-1">
                      <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-lg">
                        <img 
                          src={item.img} 
                          alt={item.productName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Text strong className="text-lg">
                          {item.productName}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          {item.description}
                        </Text>
                        <Text type="danger" className="text-xl font-semibold">
                          ¥{item.price.toFixed(2)}
                        </Text>
                        {/* <Badge 
                          color={item.quantity > 20 ? 'green' : 'red'} 
                          text={`库存: ${item.quantity}`} 
                        /> */}
                      </div>
                    </Space>
                    <Space size="large" direction="vertical" align="end" className="min-w-[120px]">
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.productId, value || 1)}
                        addonAfter="件"
                        className="w-32"
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeItem(item.productId)}
                        className="hover:opacity-80"
                      >
                        删除
                      </Button>
                    </Space>
                  </div>
                </Card>
              </List.Item>
            )}
            className="space-y-4"
          />
          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-end items-center gap-4">
              <Text className="text-base">
                商品总数: <Text strong>{cartItems.length}</Text> 件
              </Text>
              <Text className="text-lg">
                总计: <Text type="danger" strong className="text-xl">¥{totalAmount.toFixed(2)}</Text>
              </Text>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleCheckout}
                className="min-w-[120px] hover:opacity-90"
              >
                结算
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
