import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, Select, Button, message, Typography, Space, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import http from '../utils/http';
import ImageUploader from '../components/ImageUploader';
import RichTextEditor from '../components/RichTextEditor';

const { Title } = Typography;
const { Option } = Select;

const categoryOptions = [
  { label: '贴纸', value: 'sticker' },
  { label: '服装', value: 'clothing' },
  { label: '数码', value: 'digital' },
  { label: '书籍', value: 'book' },
  { label: '其他', value: 'other' },
  { label: 'T恤', value: 't-shirt' },
];

const CreateProduct: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleCreateProduct = async (values: any) => {
    if (!imageUrl) {
      message.error('请先上传商品图片');
      return;
    }

    setIsLoading(true);
    try {
      const response = await http.post("/product/create", {
        name: values.name,
        description: values.description,
        picture: imageUrl, // Use the uploaded image URL
        price: values.price,
        categories: values.categories,
      });
      
      message.success("商品创建成功");
      
      // Navigate to the newly created product
      if (response.data && response.data.product && response.data.product.id) {
        navigate(`/product/${response.data.product.id}`);
      } else {
        // If no product ID is returned, go to home page
        navigate('/');
      }
    } catch (error) {
      console.error("创建商品失败:", error);
      message.error("创建商品失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url);
  };

  return (
    <Card className="m-4">
      <Title level={2} className="mb-6">创建新商品</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateProduct}
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        <Form.Item
          name="name"
          label="商品名称"
          rules={[{ required: true, message: '请输入商品名称' }]}
        >
          <Input placeholder="请输入商品名称" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="商品描述"
          rules={[{ required: true, message: '请输入商品描述' }]}
        >
          <RichTextEditor placeholder="请输入商品描述" />
        </Form.Item>
        
        <Form.Item
          label="商品图片"
          required
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <ImageUploader onUploadSuccess={handleImageUploadSuccess} />
            
            {/* Preview the uploaded image */}
            {imageUrl && (
              <div style={{ marginTop: 16 }}>
                <p>已上传图片预览：</p>
                <Image 
                  src={imageUrl} 
                  width={200} 
                  alt="商品图片"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
          </Space>
        </Form.Item>
        
        <Form.Item
          name="price"
          label="商品价格"
          rules={[{ required: true, message: '请输入商品价格' }]}
        >
          <InputNumber
            min={0.01}
            step={0.01}
            precision={2}
            style={{ width: '100%' }}
            addonBefore="¥"
            placeholder="请输入价格"
          />
        </Form.Item>
        
        <Form.Item
          name="categories"
          label="商品分类"
          rules={[{ required: true, message: '请选择商品分类' }]}
        >
          <Select mode="multiple" placeholder="选择商品分类">
            {categoryOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} size="large">
            创建商品
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateProduct;
