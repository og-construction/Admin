import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  console.log("Token:", token); // Debugging output

  if (!token) {
    console.log("User not authenticated. Redirecting to login."); // Debugging output
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
