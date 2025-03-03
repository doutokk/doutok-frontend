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
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Product } from "../types/product";
import http from "../utils/http";
import { image } from "./image";
import { isAuthenticated } from "../services/auth";

const { Title, Text } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
          <Text className="block mt-4">{product.description}</Text>
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
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default ProductDetail;
