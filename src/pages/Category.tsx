import { useParams } from 'react-router-dom';

const Category = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>分类页面</h1>
      <p>当前分类ID: {id}</p>
    </div>
  );
};

export default Category;
