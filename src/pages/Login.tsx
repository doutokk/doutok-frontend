import { Form, Input, Button, Card, message } from 'antd';
import { login } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';
import { setToken } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const response = await login(values);
      setToken(response.token);
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      message.error('登录失败');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card title="登录" className="w-[400px]">
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效的邮箱' }]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
          <div className="text-center">
            还没有账号？ <Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
