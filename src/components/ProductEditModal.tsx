import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Space } from 'antd';
import { Product } from '../types/product';
import RichTextEditor from './RichTextEditor';

const { Option } = Select;

interface ProductEditModalProps {
  visible: boolean;
  product?: Product | null;
  loading: boolean;
  isCreating?: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const categoryOptions = [
  { label: '贴纸', value: 'sticker' },
  { label: '服装', value: 'clothing' },
  { label: '数码', value: 'digital' },
  { label: '书籍', value: 'book' },
  { label: '其他', value: 'other' },
  { label: 'T恤', value: 't-shirt' },
];

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  visible,
  product,
  loading,
  isCreating = false,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (isCreating) {
        // Reset form for creating new product
        form.resetFields();
      } else if (product) {
        // Set form values for editing existing product
        form.setFieldsValue({
          name: product.name,
          description: product.description,
          picture: product.picture,
          price: product.price,
          categories: product.categories,
        });
      }
    }
  }, [visible, product, form, isCreating]);

  const title = isCreating ? "创建商品" : "修改商品";
  const submitButtonText = isCreating ? "创建" : "保存";

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item
          name="name"
          label="商品名称"
          rules={[{ required: true, message: '请输入商品名称' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="商品描述"
          rules={[{ required: true, message: '请输入商品描述' }]}
        >
          <RichTextEditor placeholder="请输入商品描述" />
        </Form.Item>
        
        <Form.Item
          name="picture"
          label="商品图片URL"
          rules={[{ required: true, message: '请输入商品图片URL' }]}
        >
          <Input />
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
        
        <Form.Item className="flex justify-end">
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {submitButtonText}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductEditModal;
