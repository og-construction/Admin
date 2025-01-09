import React from "react";
import { useNavigate } from "react-router-dom";

const SellerProduct = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Sale By Seller Box */}
        <div
          onClick={() => handleNavigation("/sale-by-seller")}
          className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-green-100 transition duration-300 w-80 h-64 text-center border border-gray-200 hover:shadow-xl"
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">🚀 Sale By Seller</h2>
          <p className="text-base text-gray-600">
            Take control of your sales! Manage your products directly and connect with
            your customers effortlessly.
          </p>
        </div>

        {/* Sale By OGCS Box */}
        <div
          onClick={() => handleNavigation("/sale-by-ogcs")}
          className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-green-100 transition duration-300 w-80 h-64 text-center border border-gray-200 hover:shadow-xl"
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">💼 Sale By OGCS</h2>
          <p className="text-base text-gray-600">
            Let us handle the hassle! We manage your product sales, ensuring maximum
            visibility and seamless delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerProduct;
