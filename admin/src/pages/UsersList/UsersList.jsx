import React, { useEffect, useState } from 'react';
import './UsersList.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const UsersList = ({ url }) => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null); // ID of the user being edited
  const [editData, setEditData] = useState({});

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/user/list`);
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error('Error fetching users');
      }
    } catch (error) {
      toast.error('Error fetching users');
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditData({ ...user, password: '', cartData: JSON.stringify(user.cartData || {}, null, 2) });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async () => {
    try {
      const parsedCartData = editData.cartData ? JSON.parse(editData.cartData) : undefined;

      const response = await axios.put(`${url}/api/user/update`, {
        id: editingId,
        name: editData.name,
        email: editData.email,
        password: editData.password || undefined, // Only send if password is provided
        cartData: parsedCartData,
      });

      if (response.data.success) {
        toast.success('User updated successfully');
        setEditingId(null);
        fetchUsers();
      } else {
        toast.error('Error updating user');
      }
    } catch (error) {
      toast.error('Error saving changes. Ensure cartData is valid JSON.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const removeUser = async (userId) => {
    try {
      const response = await axios.post(`${url}/api/user/remove`, { id: userId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchUsers();
      } else {
        toast.error('Error removing user');
      }
    } catch (error) {
      toast.error('Error removing user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-list add flex-col">
      <h2>All Users</h2>
      <div className="users-table">
        <div className="users-table-format title">
          <b>Name</b>
          <b>Email</b>
          <b>Password</b>
          <b>Actions</b>
        </div>
        {users.map((user) => (
          <div key={user._id} className="users-table-format">
            {editingId === user._id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
                <input
                  type="password"
                  name="password"
                  value={editData.password}
                  onChange={handleInputChange}
                  placeholder="Password (leave empty to keep unchanged)"
                />
                <button className="save-btn" onClick={saveChanges}>Save</button>
                <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <p>{user.name}</p>
                <p>{user.email}</p>
                <p>{'*'.repeat(8)}</p> {/* Display password as asterisks */}
                <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
              </>
            )}
            <button onClick={() => removeUser(user._id)} className="remove-btn">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;
