import { useEffect, useState } from 'react';
import { Typography, Form, Input, Button, List, Card, Space, Divider, message } from 'antd';
import { ShoppingCartOutlined, EnvironmentOutlined } from '@ant-design/icons';
import http from '../utils/http';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

interface CartItem {
  productId: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  img: string;
}

interface AddressFormData {
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  email: string;
}

const OrderConfirmation = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

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

  const handleSubmit = async (values: AddressFormData) => {
    if (cartItems.length === 0) {
      message.error('购物车为空，无法创建订单');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        user_currency: "CNY",
        address: {
          street_address: values.streetAddress,
          city: values.city,
          state: values.state,
          country: values.country,
          zip_code: parseInt(values.zipCode) || 0
        },
        email: values.email,
        order_items: cartItems.map(item => ({
          item: {
            product_id: item.productId,
            quantity: item.quantity
          }
        }))
      };

      await http.post('/order', orderData);
      message.success('订单创建成功');
      navigate('/orders');
    } catch (error) {
      console.error('创建订单失败:', error);
      message.error('创建订单失败');
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2}>订单确认</Title>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items summary - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <Card title={<span><ShoppingCartOutlined /> 商品清单</span>}>
            <List
              loading={loading}
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item>
                  <div className="flex w-full items-center gap-4">
                    <div className="w-16 h-16 overflow-hidden rounded">
                      <img 
                        src={item.img} 
                        alt={item.productName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Text strong>{item.productName}</Text>
                      <div className="text-gray-500 text-sm">{item.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-500 font-medium">¥{item.price.toFixed(2)}</div>
                      <div className="text-gray-500">x {item.quantity}</div>
                    </div>
                  </div>
                </List.Item>
              )}
              footer={
                <div className="flex justify-end text-lg">
                  <Text>总计: <Text strong type="danger">¥{totalAmount.toFixed(2)}</Text></Text>
                </div>
              }
            />
          </Card>
        </div>

        {/* Address form - 1/3 width on large screens */}
        <div>
          <Card title={<span><EnvironmentOutlined /> 收货地址</span>}>
            <Form 
              form={form}
              layout="vertical" 
              onFinish={handleSubmit}
              initialValues={{
                country: '中国',
              }}
            >
              <Form.Item
                name="email"
                label="电子邮箱"
                rules={[{ required: true, message: '请输入电子邮箱', type: 'email' }]}
              >
                <Input placeholder="请输入电子邮箱" />
              </Form.Item>
              
              <Form.Item
                name="streetAddress"
                label="详细地址"
                rules={[{ required: true, message: '请输入详细地址' }]}
              >
                <Input placeholder="街道、门牌号等" />
              </Form.Item>
              
              <Form.Item
                name="city"
                label="城市"
                rules={[{ required: true, message: '请输入城市' }]}
              >
                <Input placeholder="城市" />
              </Form.Item>
              
              <Form.Item
                name="state"
                label="省份/州"
                rules={[{ required: true, message: '请输入省份/州' }]}
              >
                <Input placeholder="省份/州" />
              </Form.Item>
              
              <Form.Item
                name="country"
                label="国家"
                rules={[{ required: true, message: '请输入国家' }]}
              >
                <Input placeholder="国家" />
              </Form.Item>
              
              <Form.Item
                name="zipCode"
                label="邮政编码"
                rules={[{ required: true, message: '请输入邮政编码' }]}
              >
                <Input placeholder="邮政编码" />
              </Form.Item>
              
              <Divider />
              
              <Form.Item>
                <div className="flex justify-between">
                  <Button onClick={() => navigate('/cart')}>
                    返回购物车
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={submitting}
                    disabled={cartItems.length === 0}
                  >
                    确认下单
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
