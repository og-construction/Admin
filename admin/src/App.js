import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import PendingOrders from "./components/PendingOrders";
import ShippedOrders from "./components/ShippedOrders";
import DeliveredOrders from "./components/DeliveredOrders";
import CanceledOrders from "./components/CanceledOrders";
import ConfirmedOrders from "./components/ConfirmedOrders";
import CategoryManagement from "./components/pages/Category";
import SubcategoryManagement from "./components/pages/subcategories";
import AllUsers from "./components/pages/Users/allUsers";
import CreateUser from "./components/pages/Users/createUser";
import NewUsers from "./components/pages/Users/newUsers";
import CreateAdmin from "./components/admin/createAdmin";
import ManageAdmins from "./components/admin/getAllAdmins";
import InterestedUsers from "./components/pages/interestedUsers/interestedUsers";
import Products from "./components/pages/manageProducts/products";
import NewProduct from "./components/pages/manageProducts/NewProduct";
import TotalProducts from "./components/pages/manageProducts/TotalProducts";
import ApprovedProducts from "./components/pages/manageProducts/ApprovedProducts";
import NotApprovedProducts from "./components/pages/manageProducts/NotApprovedProducts";
import ProductDetails from "./components/pages/manageProducts/ProductDetails";
import CreateProduct from "./components/pages/manageProducts/CreateProduct";
import SellerProduct from "./components/pages/manageProducts/SellerProducts";
import SaleBySellerPage from "./components/pages/manageProducts/SaleBySellerPage";
import SaleByOGCSPage from "./components/pages/manageProducts/SaleByOGCSPage";
import Login from "./components/admin/loginpage";
import ProtectedRoute from "./components/protectedRoute/protectedRoute.jsx";
import SellerDetailsPage from "./components/pages/manageProducts/SellerDetailsPage.jsx";
import OgcsSellerDetailsPage from "./components/pages/manageProducts/OgcsSellerDetailsPage.jsx";
import ApproveProductsPage from "./components/pages/manageProducts/NotApprovedProducts";
import UserDetails from "./components/pages/Users/UserDetails.jsx";
// import AdminSellers from "./components/pages/Sellers/allSellers.jsx";
import AllSellers from "./components/pages/Sellers/allSellers.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                {/* Sidebar only for authenticated users */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-grow p-4 bg-gray-100">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/orders/all" element={<Orders />} />
                    <Route path="/orders/pending" element={<PendingOrders />} />
                    <Route path="/orders/confirmed" element={<ConfirmedOrders />} />
                    <Route path="/orders/shipped" element={<ShippedOrders />} />
                    <Route path="/orders/delivered" element={<DeliveredOrders />} />
                    <Route path="/orders/canceled" element={<CanceledOrders />} />
                    <Route path="/category" element={<CategoryManagement />} />
                    <Route path="/subcategories" element={<SubcategoryManagement />} />
                    <Route path="/users/all" element={<AllUsers />} />
                    <Route path="/users/create" element={<CreateUser />} />
                    <Route path="/users/new" element={<NewUsers />} />
                    <Route path="/admins/create" element={<CreateAdmin />} />
                    <Route path="/admins/all" element={<ManageAdmins />} />
                    <Route path="/salebysellers" element={<InterestedUsers />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/new" element={<NewProduct />} />
                    <Route path="/products/total" element={<TotalProducts />} />
                    <Route path="/products/approved" element={<ApprovedProducts />} />
                    <Route path="/waiting-for-approval" element={<ApproveProductsPage />} />
                    <Route path="/products/details/:id" element={<ProductDetails />} />
                    <Route path="/products/create" element={<CreateProduct />} />
                    <Route path="/seller-products" element={<SellerProduct />} />
                    <Route path="/sale-by-seller" element={<SaleBySellerPage />} />
                    <Route path="/seller-details/:sellerId" element={<SellerDetailsPage />} />
                    <Route path="/sale-by-ogcs" element={<SaleByOGCSPage />} />
                    <Route path="/ogcs-product-details/:id" element={<OgcsSellerDetailsPage />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/user/:id" element={<UserDetails />} />
                    <Route path="/sellers/all" element={<AllSellers />} />

                    {/* Redirect unknown paths to the dashboard */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
