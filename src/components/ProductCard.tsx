import { Card, Tag } from 'antd';
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
          alt={product.name}
          src={product.picture}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
    >
      <Card.Meta
        title={product.name}
        description={
          <div>
            <p className="text-red-600 font-bold text-lg">¥{product.price}</p> 
            <div className="mt-2">
              {product.categories?.map((category) => (
                <Tag key={category} color="blue">{category}</Tag>
              ))}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
