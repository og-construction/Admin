import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseurl } from "../../config/url";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseurl}/api/admin/user/details/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };

    getUserDetails();
  }, [id]);

  

  if (!user) return <div className="p-4"><p>Loading user details...</p></div>;

  return (
    <>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">User Details</h2>
        <p><strong>ID:</strong> {user._id}</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Mobile:</strong> {user.mobile}</p>
        <p><strong>Status:</strong> {user.isBlocked ? "Blocked" : "Active"}</p>
        <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <p><strong>Name:</strong> {user.product?.name || "No product available"}</p>
        <p><strong>Description :</strong>{user.product?.description || "No product available"}</p>
      </div>
    </>
  );
};

export default UserDetails;
