import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-mist text-slate-700 dark:bg-slate-950 dark:text-white">Loading planner...</div>;
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return children;
}
