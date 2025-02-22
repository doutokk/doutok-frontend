import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import Cart from '../pages/Cart';
import Search from '../pages/Search';
import Category from '../pages/Category';
import ProductDetail from '../pages/ProductDetail';
import Register from '../pages/Register';
import Orders from '../pages/Orders';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/search',
        element: <Search />,
      },
      {
        path: '/category/:id',
        element: <Category />,
      },
      {
        path: '/product/:id',
        element: <ProductDetail />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/orders',
        element: <Orders />,
      },
    ],
  },
]);

export default router;
