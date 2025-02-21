import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Product } from '../types/product';
import http from '../utils/http';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await http.get(`/product/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('获取商品详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!product) {
    return <div>商品未找到</div>;
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <img src={product.img} alt={product.product_name} className="w-full" />
        </div>
        <div>
        <h1 className="text-2xl font-bold mb-4">{product.product_name}</h1>
          <p className="text-xl font-bold text-red-600">¥{product.price}</p>
          <p className="mt-4">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
