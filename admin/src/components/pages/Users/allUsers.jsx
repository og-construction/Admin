import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { baseurl } from "../../config/url";


 
const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUsersCount, setNewUsersCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectProduct, setSelectedProduct] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showSidebar, setShowSidebar] = useState(false);
  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState(null);
  const { id } = useParams();  // Order ID from the URL
  const [order, setOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseurl}/api/admin/user/all-users`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        });

          // Check if the API returned an array or an object with data
          const usersData = Array.isArray(response.data) ? response.data : response.data.users || [];
          setUsers(usersData);

        // Assuming the API provides a `createdAt` field for user creation date
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
        const newUsers = usersData.filter((user) => user.createdAt?.startsWith(today));
        setNewUsersCount(newUsers.length);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user) =>
        user._id.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        (user.sellerName && user.sellerName.toLowerCase().includes(query))
    );
    setFilteredUsers(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseurl}/api/admin/user/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedUsers = users.filter((user) => user._id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers); // Ensure filtered users are updated
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };


  const handleBlock = async (id, isBlocked) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = isBlocked
        ? `${baseurl}/api/admin/user/unblock/${id}`
        : `${baseurl}/api/admin/user/block/${id}`;
      await axios.put(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, isBlocked: !isBlocked } : user
        )
      );
      alert(`User ${isBlocked ? "unblocked" : "blocked"} successfully!`);
    } catch (error) {
      console.error("Error blocking/unblocking user:", error.message);
    }
  };

  const handleViews = (orderId) => {
    if (!orderId) {
        console.error("Order ID is missing!");
        return;
        
    }
    navigate(`/user/${orderId}`);
};
const handleViewDetails = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const userResponse = await axios.get(`${baseurl}/api/admin/user/details/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSelectedUser(userResponse.data);


    // Fetch order by userId or corresponding orderId if available
    
    
    const orderResponse = await axios.get(`${baseurl}/api/order/get-user-order/${userId}`,
      {
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    );
    setOrder(Array.isArray(orderResponse.data) ? orderResponse.data : [orderResponse.data]);
      setShowSidebar(true);
    } catch (error) {
      console.error("Error fetching user or order details:", error.message);
    }
  };

  // const fetchProductDetails = async (productId) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(`${baseurl}/api/order/${productId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching product details:", error.message);
  //     return null;
  //   }
  // };
  
  const handleOrderView = async (orderId) => {
    try {
      // Fetch order details using the orderId
      const orderDetails = await fetchOrderById(orderId);
      
      if (orderDetails) {
        setSelectedOrder(orderDetails); // Set the fetched order details to selectedOrder
        setShowModal(true); // Show the modal
      } else {
        console.error("Order details not found");
      }
    } catch (error) {
      console.error("Error handling order view:", error.message);
    }
  };
  
  
  

  const closeSidebar = () => {
    setShowSidebar(false);
    setSelectedUser(null);
  };

  const closeModal = () => {
    setShowModal(false);
    // setProductDetails(null);
  };

  const fetchOrderById = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseurl}/api/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return the fetched order details
    } catch (error) {
      console.error("Error fetching order by ID:", error.message);
      return null;
    }
  };
  

  // useEffect(() => {
  //   const fetchProductsAndSeller = async () => {
  //     try {
  //       const token = localStorage.getItem("token");

  //       // Fetch products
  //       const productsResponse = await axios.get(
  //         `${baseurl}/api/admin/user/products/${id}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );

  //       // Fetch seller details
  //       const sellerResponse = await axios.get(
  //         `${baseurl}/api/admin/user/details/${id}`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );

  //       setProducts(productsResponse.data);
  //       setSeller(sellerResponse.data);
  //     } catch (error) {
  //       console.error("Error fetching products or seller details:", error.message);
  //     }
  //   };

  //   fetchProductsAndSeller();
  // }, [id]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by ID, Name, or Seller Name"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded shadow"
        />
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">New Users Today</h3>
          <p className="text-2xl font-bold text-green-600">{newUsersCount}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{users.length}</p>
        </div>
      </div>

      {/* Users Table */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID :</th>
            <th className="border px-4 py-2">Name :</th>
            <th className="border px-4 py-2">Email:</th>
            <th className="border px-4 py-2">mobile No:</th>
            <th className="border px-4 py-2">Status :</th>
            <th className="border px-4 py-2">Actions :</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{user._id}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.mobile}</td>
              <td className="border px-4 py-2">
                {user.isBlocked ? "Blocked" : "Active"}
              </td>
              <td className="border px-4 py-2 flex gap-2">
              <button
                    className=" bg-green-500 text-white px-3 py-2 rounded-md shadow hover:bg-green-600 transition duration-200"
                    onClick={() => handleViewDetails(user._id)}
                  >
                    View Details
                  </button>

                
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleBlock(user._id, user.isBlocked)}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
                </td>
              
            </tr>
          ))}
        </tbody>
      </table>
  
{/* Sidebar */}
{showSidebar && selectedUser && (
  <div className="fixed right-0 top-0 h-full w-100 bg-white shadow-2xl p-6 overflow-y-auto z-50">
    <button
      className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
      onClick={closeSidebar}
    >
       Close Sidebar
      &times;
    </button>
    <h2 className="text-3xl font-bold text-blue-600 mb-6">
      {selectedUser.name}
    </h2>
    <div className="space-y-4 text-sm">
      <p>
        <span className="font-semibold">Email:</span> {selectedUser.email}
      </p>
      <p>
        <span className="font-semibold">mobile:</span> {selectedUser.mobile}
      </p>
      <p>
        <span className="font-semibold">Address:</span> {selectedUser.address}
      </p>
      <p>
        <span className="font-semibold">Type:</span> {selectedUser.type}
      </p>

      <p>
        <span className="font-semibold">Verified:</span> {selectedUser.isVerified}
        {selectedUser.isVerified ? "Yes" : "No"}
      </p>
      <p>
        <span className="font-semibold">Status:</span>{" "}
        {selectedUser.isBlocked ? "Blocked" : "Active"}
      </p>
      <p>
        <span className="font-semibold">Created At:</span>{" "}
        {new Date(selectedUser.createdAt).toLocaleString()}
      </p>
      <p>
        <span className="font-semibold">Updated At:</span>{" "}
        {new Date(selectedUser.updatedAt).toLocaleString()}
      </p>

      <h3 className="text-xl font-bold mt-6">Orders</h3>
            {order.length > 0 ? (
              <table className="w-full mt-4 border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Gst</th>
                    <th className="border px-4 py-2">Amount</th>
                    <th className="border px-4 py-2">status</th>
                    <th className="border px-4 py-2">Items</th>
 
                    <th className="border px-4 py-2">View</th>
                  </tr>
                </thead>
                <tbody>
                  {order.map((item) => (
                    <tr key={item._id}>
                      <td className="border px-4 py-2">{item._id}</td>
                      <td className="border px-4 py-2">{item.totalGst}</td>
                      <td className="border px-4 py-2">{item.totalAmount}</td>
                      <td className="border px-4 py-2">{item.status}</td>
                      <td className="border px-4 py-2">{item.items.length}</td>
                      <td className="border px-4 py-2"> {item.product}</td>
                      <td className="border px-2 py-1">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() =>  handleOrderView(item._id)}
                    >
                      View
                    </button>
                  </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            ) : (
              <p>No orders available for this user.</p>
            )}
            </div>
          </div>
        )}

{showModal && selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-screen-sm mx-4 overflow-y-auto">
      
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p>
              <strong>Order ID:</strong> {selectedOrder._id || "N/A"}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{selectedOrder.totalAmount || "N/A"}
            </p>
            <p>
              <strong>Total GST:</strong> ₹{selectedOrder.totalGst || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status || "N/A"}
            </p>
            
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString() || "N/A"}
            </p>

            <h3 className="text-lg font-bold mt-4">Items:</h3>
{selectedOrder.items && selectedOrder.items.length > 0 ? (
  <table className="text-lg font-bold mt-4">
    <thead>
      <tr className="bg-gray-100">
        <th className="border px-4 py-2">Product Name</th>
        <th className="border px-4 py-2">Quantity</th>
        <th className="border px-4 py-2">Seller</th>
        <th className="border px-4 py-2">Price</th>
        <th className="border px-4 py-2">Total</th>
      </tr>
    </thead>
    <tbody>
      {selectedOrder.items.map((item, index) => (
        <tr key={index}>
          <td className="border px-4 py-2">
            {item.product.name || "N/A"} {/* Access the `name` property */}
          </td>
          <td className="border px-4 py-2">{item.quantity || 0}</td>
          <td className="border px-4 py-2">{item.seller || "N/A"}</td>
          <td className="border px-4 py-2">{item.price || 0}</td>
          <td className="border px-4 py-2">{item.subtotalwithgst || 0}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No items available for this order.</p>
)}


            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AllUsers;
