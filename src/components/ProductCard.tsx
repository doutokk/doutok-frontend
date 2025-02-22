import { Card } from 'antd';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card
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
  );
};

export default ProductCard;
