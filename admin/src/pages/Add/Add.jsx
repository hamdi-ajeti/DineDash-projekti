import React, { useState, useEffect } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'



const Add = ({ url }) => {


  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
    restaurantId: "" // <-- new field
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("restaurantId", data.restaurantId); // <-- ✅ ADD THIS
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);

      if (response.data.success) {
        // No need for second POST request if your backend already links food to restaurant
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad",
          restaurantId: ""
        });
        setImage(false);
        toast.success("Food added to restaurant menu!");
      } else {
        toast.error("Error adding food item.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
    }
  };


  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(`${url}/api/restaurant/list`);
        if (res.data.success) {
          setRestaurants(res.data.data);
        } else {
          toast.error("Failed to fetch restaurants");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error loading restaurants");
      }
    };

    fetchRestaurants();
  }, []);


  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-image-upload flex-col">
          <h3>Upload Image</h3>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' name='image' hidden required />
        </div>
        <div className="add-product-name flex-col">
          <h3>Product Name</h3>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
        </div>
        <div className="add-product-description flex-col">
          <h3>Product description</h3>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write description here' required></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <h3>Product Category</h3>
            <select onChange={onChangeHandler} name="category">
              <option value="Salad">Salad</option>
              <option value="Pizza">Pizza</option>
              <option value="Dessert">Dessert</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Steak">Steak</option>
              <option value="Pasta">Pasta</option>
              <option value="Drinks">Drinks</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <h3>Product price</h3>
            <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='200 Mkd' />
          </div>
        </div>
        <div className="select-restaurant">
          <h3>Select Restaurant</h3>
          <select onChange={onChangeHandler} name="restaurantId" value={data.restaurantId} required>
            <option value=""> Select Restaurant </option>
            {restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
        <button type='submit' className='add-btn'>Add product</button>
      </form>
    </div>
  )
}


export default Add
