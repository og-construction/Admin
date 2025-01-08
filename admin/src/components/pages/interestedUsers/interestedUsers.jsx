import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InterestedUsers = () => {
  const { id } = useParams();
  const [interestedUsers, setInterestedUsers] = useState([]);

  useEffect(() => {
    const fetchInterestedUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/admin/sellers/${id}/interested-users`
        );
        setInterestedUsers(response.data);
      } catch (error) {
        console.error("Error fetching interested users:", error.message);
      }
    };

    fetchInterestedUsers();
  }, [id]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Interested Users</h2>
      {interestedUsers.length > 0 ? (
        <ul className="list-disc ml-6">
          {interestedUsers.map((user) => (
            <li key={user.userId._id}>
              {user.userId.name} ({user.userId.email}) - Interested in{" "}
              {user.productId.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No interested users found for this seller.</p>
      )}
    </div>
  );
};

export default InterestedUsers;
