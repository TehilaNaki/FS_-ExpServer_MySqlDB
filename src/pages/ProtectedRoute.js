import { Navigate } from "react-router-dom";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children, user, setUser }) => {
  const user_localStorage = window.localStorage.getItem("user");
    useEffect(() => {
      setUser(JSON.parse(user_localStorage));
    }, []);

  if (!user) {
    if (!user_localStorage) return <Navigate to="Login" />;
  
  }
  return children;
};

export default ProtectedRoute;
