import React, { useState } from 'react';
import './AddUsers.css'; 
import axios from 'axios';
import { toast } from 'react-toastify';

const AddUsers = ({ url }) => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

const onSubmitHandler = async (event) => {
  event.preventDefault();

  try {
    const res = await axios.post(`${url}/api/user/register`, {
      ...data,
      fromAdmin: true, // let backend know it's from admin
    });

    if (res.data.success) {
      toast.success('User added successfully!');
      setData({
        name: '',
        email: '',
        password: '',
      });
    } else {
      toast.error(res.data.message || 'Failed to add user');
    }
  } catch (error) {
    console.error(error);
    toast.error('Something went wrong. Check server response.');
  }
};

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-product-name flex-col">
          <h3>User Name</h3>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={onChangeHandler}
            placeholder="Enter user name"
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <h3>Email</h3>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            placeholder="Enter user email"
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <h3>Password</h3>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit" className="add-btn">
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUsers;
