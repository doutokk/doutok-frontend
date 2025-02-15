import { Form, Input, Button, Card, message } from 'antd';
import { register } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await register(values);
      message.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      message.error('注册失败');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card title="注册" className="w-[400px]">
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
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              注册
            </Button>
          </Form.Item>
          <div className="text-center">
            已有账号？ <Link to="/login">返回登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
