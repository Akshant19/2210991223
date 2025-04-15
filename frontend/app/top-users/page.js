"use client";
import { useState, useEffect } from "react";
import { getTopUsers } from "@/lib/api";

export default function TopUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getTopUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="max-w-2xl mx-auto">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Top Users</h1>
      <div className="grid grid-cols-2 gap-4">
        {users && users.length > 0 ? (
          users.map((user, index) => (
            <div
              key={`user-${user.id}-${index}`}
              className="bg-white border border-gray-200 rounded-xl p-6 flex items-center hover:shadow-lg transition-all duration-300"
            >
              <span className="text-2xl font-bold text-blue-600 mr-6">
                #{index + 1}
              </span>
              <div>
                <h3 className="font-medium text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">
                  {user.commentCount} comments
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No users available</p>
        )}
      </div>
    </div>
  );
}
