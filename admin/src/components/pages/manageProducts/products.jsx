import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaClock, FaList, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import { baseurl } from "../../config/url";

const Products = () => {
  const [productCounts, setProductCounts] = useState({
    totalProducts: 0,
    recentlyAddedProducts: [],
    approvedProducts: 0,
    unapprovedProducts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseurl}/api/product/counts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProductCounts(response.data);
      } catch (error) {
        console.error("Error fetching product counts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductCounts();
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-8 text-gray-800">
        Product Management
      </h1>
      <div className="flex justify-center flex-wrap gap-8 px-4">
        {/* Total Product Box */}
        <Link
          to="/products/total"
          className="bg-white text-black w-72 h-48 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg hover:bg-gray-200 transition"
        >
          <FaList className="text-4xl mb-3 text-green-500" />
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-2xl font-bold">{productCounts.totalProducts}</p>
        </Link>
{/* Recently Added Products Box */}
<Link
  to="/products/new"
  className="bg-white text-black w-72 h-48 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg hover:bg-gray-200 transition"
>
  <FaClock className="text-4xl mb-3 text-blue-500" />
  <h2 className="text-xl font-semibold">Recently Added Products</h2>
  <p className="text-2xl font-bold">{productCounts.recentlyAddedProducts.length}</p>
</Link>

        {/* Unapproved Product Box */}
        <Link
          to="/products/not-approved"
          className="bg-white text-black w-72 h-48 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg hover:bg-gray-200 transition"
        >
          <FaTimes className="text-4xl mb-3 text-red-500" />
          <h2 className="text-xl font-semibold">Unapproved Products</h2>
          <p className="text-2xl font-bold">{productCounts.unapprovedProducts}</p>
        </Link>

{/* Approved Products Box */}
<Link
  to="/products/approved"
  className="bg-white text-black w-72 h-48 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg hover:bg-gray-200 transition"
>
  <FaCheck className="text-4xl mb-3 text-green-600" />
  <h2 className="text-xl font-semibold">Approved Products</h2>
  <p className="text-2xl font-bold">{productCounts.approvedProducts}</p>
</Link>



      </div>
    </div>
  );
};

export default Products;
