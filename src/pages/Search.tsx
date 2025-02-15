import { useSearchParams } from 'react-router-dom';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div>
      <h1>搜索结果</h1>
      <p>搜索关键词: {query}</p>
    </div>
  );
};

export default Search;
