import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

interface AuthRouteProps {
  children: JSX.Element;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthRoute;
