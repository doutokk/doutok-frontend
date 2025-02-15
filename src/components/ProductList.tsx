import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Product } from '../types/product';

interface ProductListProps {
  products: Product[];
  loading: boolean;
}

const ProductList = ({ products, loading }: ProductListProps) => {
  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {products.map((product) => (
        <Link 
          key={product.product_id} 
          to={`/product/${product.product_id}`}
          className="block  rounded-lg p-4 "
        >
          <ProductCard product={product} />
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
