import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from '../components/ProductList';
import { Product } from '../types/product';
import { API_BASE_URL } from '../config/api';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/product`);
        setProducts(data.item);
      } catch (error) {
        console.error('获取产品列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">搜索结果</h1>
      <ProductList products={products} loading={loading} />
    </div>
  );
};

export default Search;
