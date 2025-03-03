import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  Image,
  Button,
  Spin,
  Result,
  Typography,
  message,
  InputNumber,
  Space,
  Tag,
  Modal,
} from "antd";
import { ShoppingCartOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Product } from "../types/product";
import http from "../utils/http";
import { image } from "./image";
import { isAuthenticated, hasRole } from "../services/auth";
import ProductEditModal from "../components/ProductEditModal";

const { Title, Text } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = hasRole("admin");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await http.get(`/product/${id}`);
        setProduct(data.product);
      } catch (error) {
        console.error("获取商品详情失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated()) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    // Add validation to prevent adding zero or negative quantities
    if (quantity <= 0) {
      message.error("商品数量必须大于0");
      return;
    }

    setAddingToCart(true);
    try {
      console.log(product);
      
      await http.post("/cart/edit", {
        items: [
          {
            product_id: product.id,
            quantity: quantity,
          },
        ],
      });
      message.success("已添加到购物车");
    } catch (error) {
      console.error("添加到购物车失败:", error);
      message.error("添加到购物车失败，请重试");
    } finally {
      setAddingToCart(false);
    }
  };

  const showEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handleUpdateProduct = async (values: any) => {
    if (!product) return;
    
    setIsUpdating(true);
    try {
      await http.put("/product/edit", {
        product: {
          id: product.id,
          name: values.name,
          description: values.description,
          picture: values.picture,
          price: values.price,
          categories: values.categories,
        },
      });
      
      message.success("商品更新成功");
      setIsEditModalVisible(false);
      
      // Update the product in the local state
      setProduct({
        ...product,
        ...values,
      });
    } catch (error) {
      console.error("更新商品失败:", error);
      message.error("更新商品失败，请重试");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProduct = () => {
    if (!product) return;
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除商品 "${product.name}" 吗？此操作不可撤销。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        setIsDeleting(true);
        try {
          await http.delete(`/product/${product.id}`);
          message.success('商品已成功删除');
          navigate('/'); // Navigate to homepage after deletion
        } catch (error) {
          console.error('删除商品失败:', error);
          message.error('删除商品失败，请重试');
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <Result
        status="404"
        title="商品未找到"
        subTitle="抱歉，您访问的商品不存在"
      />
    );
  }

  const categoryOptions = [
    { label: '贴纸', value: 'sticker' },
    { label: '服装', value: 'clothing' },
    { label: '数码', value: 'digital' },
    { label: '书籍', value: 'book' },
    { label: '其他', value: 'other' },
  ];

  return (
    <Card className="m-4">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <Image
            src={product.picture}
            alt={product.name}
            className="w-full"
            fallback={image}
          />
        </div>
        <div>
          <Title level={2}>{product.name}</Title>
          <Text className="text-2xl text-red-600 block mt-4">
            ¥{product.price}
          </Text>
          <div className="mt-2 mb-4">
            {product.categories?.map((category) => (
              <Tag key={category} color="blue">{category}</Tag>
            ))}
          </div>
          <div 
            className="mt-4 product-description" 
            dangerouslySetInnerHTML={{ __html: product.description || '' }}
          />
          <Space className="mt-6">
            <InputNumber
              min={1}
              max={99}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
              addonBefore="数量"
            />
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={handleAddToCart}
              loading={addingToCart}
              danger
            >
              加入购物车
            </Button>
            {isAdmin && (
              <>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  size="large"
                  onClick={showEditModal}
                >
                  修改商品
                </Button>
                <Button
                  type="default"
                  icon={<DeleteOutlined />}
                  size="large"
                  onClick={handleDeleteProduct}
                  loading={isDeleting}
                  danger
                >
                  删除商品
                </Button>
              </>
            )}
          </Space>
        </div>
      </div>

      {isAdmin && (
        <ProductEditModal
          visible={isEditModalVisible}
          product={product}
          loading={isUpdating}
          onCancel={() => setIsEditModalVisible(false)}
          onSubmit={handleUpdateProduct}
        />
      )}
    </Card>
  );
};

export default ProductDetail;
