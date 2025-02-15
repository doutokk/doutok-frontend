import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import { Product } from '../types/product';
import { API_BASE_URL } from '../config/api';

const Category = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(`${API_BASE_URL}/product`, {
          page,
          pageSize,
          categoryName: id
        });
        setProducts(data.item);
      } catch (error) {
        console.error('获取产品列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, page]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">分类商品</h1>
      <ProductList products={products} loading={loading} />
    </div>
  );
};

export default Category;
