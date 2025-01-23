import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role ,children }) => {
  const userRole = localStorage.getItem("role");

  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" />;
  }
  
  const token = localStorage.getItem("token");
  console.log("Token:", token); // Debugging output

  if (!token) {
    console.log("User not authenticated. Redirecting to login."); // Debugging output
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
