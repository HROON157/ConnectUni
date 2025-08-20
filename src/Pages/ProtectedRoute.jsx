import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/Context";
import Loading from "../Components/Loading/Loading";
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) {
    return <Loading />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    if (user?.role === "student") {
      return <Navigate to="/student-dashboard" replace />;
    } else if (user?.role === "hr") {
      return <Navigate to="/hr-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  return children;
};

export default ProtectedRoute;
