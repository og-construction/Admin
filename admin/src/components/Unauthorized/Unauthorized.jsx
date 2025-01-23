import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-red-600">403 - Unauthorized</h1>
      <p className="text-lg text-gray-600 mb-4">
        You do not have permission to access this page.
      </p>
      <Link to="/" className="text-blue-500 hover:underline text-lg">
        Go back to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
