import { useEffect, useState } from 'react';
import { Carousel, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { Product } from '../types/product';
import http from '../utils/http';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const carouselCount = 5; // Number of products to show in carousel
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotProducts = async () => {
      setLoading(true);
      try {
        const { data } = await http.get(`/product?page=${page}&pageSize=${pageSize}`);
        setProducts(data.item || []);
        setTotal(data.total);
      } catch (error) {
        console.error('获取热销商品失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotProducts();
  }, [page, pageSize]);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // Get first N products for carousel
  const carouselItems = products.slice(0, carouselCount);
  
  // Navigate to product detail page
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="p-4">
      {/* Carousel Section */}
      {carouselItems.length > 0 && (
        <div className="mb-8">
          <Carousel autoplay>
            {carouselItems.map((product) => (
              <div 
                key={product.id} 
                className="carousel-item cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative h-64 md:h-96 overflow-hidden">
                  <img 
                    src={product.picture} 
                    alt={product.name}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 bg-opacity-50 text-white p-4">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <p className="text-red-400 font-bold">¥{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">热销商品</h1>
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

export default Home;
