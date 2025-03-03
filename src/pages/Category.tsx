import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import ProductList from '../components/ProductList';
import { Product } from '../types/product';
import http from '../utils/http';

const Category = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await http.post(`/product`, {
          page,
          pageSize,
          categoryName: id
        });
        setProducts(data.item);
        setTotal(data.total); // 假设接口返回total字段
      } catch (error) {
        console.error('获取产品列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">分类商品</h1>
      <ProductList products={products} loading={loading} />
      <div className="flex justify-center mt-4">
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={handlePageChange}
          showTotal={(total) => `共 ${total} 条`}
        />
      </div>
    </div>
  );
};

export default Category;
