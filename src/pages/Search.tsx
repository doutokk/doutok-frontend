import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
      <p className="mb-4">搜索关键词: {query}</p>
      
      {loading ? (
        <div>加载中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.product_id} className="border rounded-lg p-4 shadow-sm">
              <img src={product.img} alt={product.product_name} className="w-full h-48 object-cover mb-2" />
              <h2 className="text-lg font-semibold">{product.product_name}</h2>
              <p className="text-red-600 font-bold">¥{product.price}</p>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
              <p className="text-gray-500 text-sm mt-1">库存: {product.quantity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
