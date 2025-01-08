import React from "react";
import { useNavigate } from "react-router-dom";

const SellerProduct = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sale By Seller Box */}
        <div
          onClick={() => handleNavigation("/sale-by-seller")}
          className="bg-white text-black p-8 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition duration-300 w-80 h-56"
        >
          <h2 className="text-2xl font-bold mb-4">Sale By Seller</h2>
          <p className="text-center text-base">
            Manage your own products and sell them directly to customers.
          </p>
        </div>

        {/* Sale By OGCS Box */}
        <div
          onClick={() => handleNavigation("/sale-by-ogcs")}
          className="bg-white text-black p-8 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition duration-300 w-80 h-56"
        >
          <h2 className="text-2xl font-bold mb-4">Sale By OGCS</h2>
          <p className="text-center text-base">
            Let OGCS manage your product sales, including delivery and visibility.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerProduct;
