import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import ProductList from '../components/ProductList';
import { Product } from '../types/product';
import http from '../utils/http';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await http.get(
          `/product?query=${query}&page=${page}&pageSize=${pageSize}`
        );
        
        setProducts(data.item);
        setTotal(data.total);
      } catch (error) {
        console.error('获取产品列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, page, pageSize]);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">搜索结果</h1>
      <ProductList products={products} loading={loading} />
      <div className="mt-4 flex justify-center">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          showTotal={(total) => `共 ${total} 条`}
          showSizeChanger
          showQuickJumper
        />
      </div>
    </div>
  );
};

export default Search;
