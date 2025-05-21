import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';


const List = ({ url }) => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null); // ID of the item being edited
  const [editData, setEditData] = useState({});

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error('Error fetching list');
    }
  };

  // const handleEdit = (item) => {
  //   setEditingId(item._id); // Set the item being edited
  //   setEditData({ ...item }); // Pre-fill input fields with current data
  // };
  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditData({
      ...item,
      restaurantId: item.restaurantId?._id || item.restaurantId || "", // handles both populated or plain ID
    });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value })); // Update the input values
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


  const saveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('id', editingId);
      formData.append('name', editData.name);
      formData.append('category', editData.category);
      formData.append('price', editData.price);
      formData.append('description', editData.description);
      formData.append('restaurantId', editData.restaurantId);
      if (editData.image) {
        formData.append('image', editData.image);
      }

      const response = await axios.put(`${url}/api/food/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Item updated successfully');
        setEditingId(null); // Exit editing mode
        fetchList(); // Refresh the list
      } else {
        toast.error('Error updating item');
      }
    } catch (error) {
      toast.error('Error saving changes');
    }
  };

  const cancelEdit = () => {
    setEditingId(null); // Exit editing mode
    setEditData({}); // Clear edit data
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // Refresh the list after removal
      } else {
        toast.error('Error removing item');
      }
    } catch (error) {
      toast.error('Error removing item');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <h2>All foods list</h2>
      <div className="restaurant-filter">
        <label htmlFor="restaurant-select">Filter by restaurant:</label>
        <select
          id="restaurant-select"
          value={selectedRestaurantId}
          onChange={(e) => setSelectedRestaurantId(e.target.value)}
        >
          <option value="">All Restaurants</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Restaurant</b> {/* New column */}
          <b>Actions</b>
        </div>
        {list
          .filter((item) => !selectedRestaurantId || item.restaurantId?._id === selectedRestaurantId)
          .map((item) => (
            <div key={item._id} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              {editingId === item._id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                  />
                  <select name="category" onChange={handleInputChange} value={editData.category}>
                    <option value="Salad">Salad</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Steak">Steak</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Drinks">Drinks</option>
                  </select>

                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleInputChange}
                  />
                  <select
                    name="restaurantId"
                    value={editData.restaurantId || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">Select restaurant</option>
                    {restaurants.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  <button className='list-save-btn' onClick={saveChanges}>Save</button>
                  <button className='list-cancel-btn' onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <p>{item.name}</p>
                  <p>{item.category}</p>
                  <p>{item.price} mkd</p>
                  <p>{item.restaurantId?.name || "Unassigned"}</p> {/* New line */}
                  <button className='list-edit-btn' onClick={() => handleEdit(item)}>Edit</button>
                </>
              )}{/* Remove button always visible */}
              <button onClick={() => removeFood(item._id)} className="list-remove-btn">
                Remove
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default List;
