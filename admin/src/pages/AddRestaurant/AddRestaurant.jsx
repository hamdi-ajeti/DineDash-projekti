import React, { useState } from 'react';
import './AddRestaurant.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const AddRestaurant = ({ url }) => {
  const [logo, setLogo] = useState(null);
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    resId: "",
    name: ""
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  
    if (!logo || !image) {
      toast.error("Please upload both logo and background image");
      return;
    }
  
    const formData = new FormData();
    formData.append("resId", data.resId);
    formData.append("name", data.name);
    formData.append("logo", logo);
    formData.append("image", image);
  
    try {
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
          }
      const response = await axios.post(`${url}/api/restaurant/add`, formData);
      if (response.data.success) {
        setData({ resId: "", name: "" });
        setLogo(null);
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div className="add-restaurant">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-image-upload flex-col">
          <h3>Upload Logo</h3>
          <label htmlFor="logo">
            <img src={logo ? URL.createObjectURL(logo) : assets.upload_area} alt="Logo preview" />
          </label>
          <input onChange={(e) => setLogo(e.target.files[0])} type="file" id="logo" name="logo" hidden  />
        </div>

        <div className="add-image-upload flex-col">
          <h3>Upload Background Image</h3>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Background preview" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" name="image" hidden  />
        </div>

        <div className="add-restaurant-id flex-col">
          <h3>Restaurant ID</h3>
          <input type="text" name="resId" value={data.resId} onChange={onChangeHandler} placeholder="Unique ID" />
        </div>

        <div className="add-restaurant-name flex-col">
          <h3>Restaurant Name</h3>
          <input type="text" name="name" value={data.name} onChange={onChangeHandler} placeholder="Type name here"  />
        </div>

        <button type="submit" className="add-btn">Add Restaurant</button>
      </form>
    </div>
  );
};

export default AddRestaurant;