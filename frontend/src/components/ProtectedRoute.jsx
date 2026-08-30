import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 40, fontFamily: "Cairo, sans-serif" }}>جاري التحميل...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
