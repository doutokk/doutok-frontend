import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from 'antd';

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  description: string;
  img: string;
  quantity: number;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:4523/m1/5825333-5510755-default/product');
        const data = await response.json();
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
      <h1 className="text-2xl font-bold mb-4">搜索结果</h1>
      
      {loading ? (
        <div>加载中...</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {products.map((product) => (
            <Card
              key={product.product_id}
              hoverable
              style={{ width: 300, flex: '0 0 auto' }}
              cover={
                <img
                  alt={product.product_name}
                  src={product.img}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
            >
              <Card.Meta
                title={product.product_name}
                description={
                  <div>
                    <p className="text-red-600 font-bold text-lg">¥{product.price}</p>
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
