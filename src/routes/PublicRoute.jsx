import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PageLoader } from "../Components/ui/Spinner";

export default function PublicAuthRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/admin";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
