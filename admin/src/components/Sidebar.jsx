import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import {
  Dashboard,
  ShoppingCart,
  Category,
  Inventory,
  LocalShipping,
  Storefront,
  Settings,
  ExpandMore,
  ExpandLess,
  ShoppingBag,
  People,
  Logout
} from "@mui/icons-material";

const Sidebar = () => {
  const [expandedMenu, setExpandedMenu] = useState(null); // Tracks which menu is expanded
  const navigate = useNavigate();

  const toggleMenu = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login"); // Redirect to login page
  };
  const menuItems = [
    { name: "Dashboard", path: "/", icon: <Dashboard /> },
    {
      name: "Orders",
      icon: <ShoppingCart />,
      subMenu: [
        { name: "All Orders", path: "/orders/all" },
        { name: "Pending Orders", path: "/orders/pending" },
        { name: "Confirmed Orders", path: "/orders/confirmed" },
        { name: "Shipped Orders", path: "/orders/shipped" },
        { name: "Delivered Orders", path: "/orders/delivered" },
        { name: "Canceled Orders", path: "/orders/canceled" },
      ],
    },
    {
      name: "Manage Categories",
      icon: <Category />,
      subMenu: [
        { name: "Category", path: "/category" },
        { name: "Subcategories", path: "/subcategories" },
      ],
    },
    {
      name: "Manage Products",
      icon: <ShoppingBag />,
      subMenu: [
        { name: "Products", path: "/products" },
        { name: "Create Product", path: "/products/create" },
        { name: "Seller Products", path: "/seller-products" },
        { name: "Waiting for Approval", path: "/waiting-for-approval" },
      ],
    },
    {
      name: "Admins",
      icon: <People />,
      subMenu: [
        { name: "All Admins", path: "/admins/all" },
        { name: "Create Admin", path: "/admins/create" },
      ],
    },
    {
      name: "Users",
      icon: <People />,
      subMenu: [
        { name: "All Users", path: "/users/all" },
        { name: "Create User", path: "/users/create" },
        { name: "New Users", path: "/users/new" },
      ],
    },
    {
      name: "Sellers",
      icon: <People />,
      subMenu: [
        { name: "All Sellers", path: "/sellers/all" },
        { name: "Create Seller", path: "/sellers/create" },
        { name: "New Sellers", path: "/sellers/new" },
      ],
    },
    { name: "Locations", path: "/locations", icon: <LocalShipping /> },
    { name: "Sale By Sellers", path: "/salebysellers", icon: <LocalShipping /> },

    { name: "POS", path: "/pos", icon: <Storefront /> },
    { name: "Settings", path: "/settings", icon: <Settings /> },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      <ul className="space-y-4">
        {menuItems.map((item, index) => (
          <li key={index} className="cursor-pointer">
            {item.subMenu ? (
              <div>
                <div
                  onClick={() => toggleMenu(item.name)}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition duration-300"
                >
                  <span className="text-gray-400 mr-3">{item.icon}</span>
                  <span className="font-medium flex-grow">{item.name}</span>
                  {expandedMenu === item.name ? (
                    <ExpandLess className="text-gray-400" />
                  ) : (
                    <ExpandMore className="text-gray-400" />
                  )}
                </div>
                {expandedMenu === item.name && (
                  <ul className="ml-6 mt-2 space-y-2">
                    {item.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={subItem.path}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition duration-300 text-gray-300"
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                <span className="text-gray-400 mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            )}
      

          </li>
        ))}

<li className="cursor-pointer">
          <button
            onClick={handleLogout}
            className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition duration-300 w-full text-left"
          >
            <Logout className="text-gray-400 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </li>


      </ul>
    </div>
  );
};

export default Sidebar;
