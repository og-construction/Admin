import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaList, FaCheck, FaTimes } from "react-icons/fa";


const Products = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-8 text-gray-800">
        Product Management
      </h1>
       <div className="flex justify-center flex-wrap gap-8 px-4">
        {/* New Product Box */}
        <Link
          to="/products/new"
          className="bg-white text-black w-72 h-48 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg hover:bg-gray-200 transition"
        >
          <FaPlus className="text-4xl mb-3 text-blue-500" />
          <h2 className="text-xl font-semibold">New Product</h2>
        </Link>

       {/* Total Product Box */}
       <Link
          to="/products/total"
          className="bg-white text-black w-72 h-48 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg hover:bg-gray-200 transition"
        >
          <FaList className="text-4xl mb-3 text-green-500" />
          <h2 className="text-xl font-semibold">Total Product</h2>
        </Link>

        {/* Approved Product Box */}
        <Link
          to="/products/approved"
          className="bg-white text-black w-72 h-48 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg hover:bg-gray-200 transition"
        >
          <FaCheck className="text-4xl mb-3 text-yellow-500" />
          <h2 className="text-xl font-semibold">Approved Product</h2>
        </Link>

        {/* Not Approved Product Box */}
        <Link
          to="/products/not-approved"
          className="bg-white text-black w-72 h-48 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg hover:bg-gray-200 transition"
        >
          <FaTimes className="text-4xl mb-3 text-red-500" />
          <h2 className="text-xl font-semibold">Not Approved Product</h2>
        </Link>
      </div>
    </div>
  );
};

export default Products;
