import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [checkingToken, setCheckingToken] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const location = useLocation(); // ✅ capture current location

  useEffect(() => {
    // ✅ Check if token exists in localStorage (user may have refreshed)
    const token = localStorage.getItem("token");
    if (token) {
      setHasToken(true);
    }
    setCheckingToken(false);
  }, []);

  if (loading || checkingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-green-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ✅ If no user and no token → redirect, keep original location
  if (!user && !hasToken) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // ✅ If token exists or user already logged in → allow access
  return children;
};

export default ProtectedRoute;
