import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListRestaurant.css';
import { toast } from 'react-toastify';

const RestaurantList = ({ url }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const fetchRestaurants = async () => {
        try {
            const res = await axios.get(`${url}/api/restaurant/list`);
            if (res.data.success) {
                setRestaurants(res.data.data);
            } else {
                toast.error("Failed to fetch restaurants");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching restaurants");
        }
    };

    const handleEdit = (restaurant) => {
        setEditingId(restaurant._id);
        setEditData({ ...restaurant });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const saveChanges = async () => {
        try {
            const formData = new FormData();
            formData.append('id', editingId);
            formData.append('name', editData.name);
            formData.append('resId', editData.resId);
            if (editData.logo instanceof File) {
                formData.append('logo', editData.logo);
            }
            if (editData.image instanceof File) {
                formData.append('image', editData.image);
            }

            const res = await axios.put(`${url}/api/restaurant/update/${editingId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                toast.success("Restaurant updated");
                setEditingId(null);
                fetchRestaurants();
            } else {
                toast.error("Failed to update");
            }
        } catch (err) {
            toast.error("Error saving changes");
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const removeRestaurant = async (id) => {
        try {
            const res = await axios.delete(`${url}/api/restaurant/delete/${id}`);
            if (res.data.success) {
                toast.success("Deleted");
                fetchRestaurants();
            } else {
                toast.error("Error deleting restaurant");
            }
        } catch (error) {
            toast.error("Error deleting");
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    return (
        <div className="list add flex-col">
            <h2>All Restaurants</h2>
            <div className="list-table-res">
                <div className="list-res-format title">
                    <b>Image</b>
                    <b>Logo</b> {/* 👈 New column */}
                    <b>Name</b>
                    <b>ResID</b>
                    <b>Actions</b>
                </div>
                {restaurants.map((r) => (
                    <div className="list-res-format" key={r._id}>
                        {/* Image or File Input */}
                        {editingId === r._id ? (
                            <div className="file-input-wrapper">
                                <label htmlFor={`image-${r._id}`} className="custom-file-label">
                                    {editData.image instanceof File ? (
                                        <img
                                            src={URL.createObjectURL(editData.image)}
                                            alt="preview"
                                            className="restaurant-main-img"
                                        />
                                    ) : (
                                        'Choose Image'
                                    )}
                                </label>
                                <input
                                    id={`image-${r._id}`}
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) =>
                                        setEditData((prev) => ({ ...prev, image: e.target.files[0] }))
                                    }
                                    accept="image/*"
                                />
                            </div>
                        ) : (
                            <img
                                src={`${url}/images/${r.image}`}
                                alt="restaurant"
                                className="restaurant-main-img"
                            />
                        )}


                        {/* Logo or File Input */}
                        {editingId === r._id ? (
                            <div className="file-input-wrapper">
                                <label htmlFor={`logo-${r._id}`} className="custom-file-label">
                                    {editData.logo instanceof File ? (
                                        <img
                                            src={URL.createObjectURL(editData.logo)}
                                            alt="preview"
                                            className="restaurant-logo-img"
                                        />
                                    ) : (
                                        'Choose Logo'
                                    )}
                                </label>
                                <input
                                    id={`logo-${r._id}`}
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) =>
                                        setEditData((prev) => ({ ...prev, logo: e.target.files[0] }))
                                    }
                                    accept="image/*"
                                />
                            </div>
                        ) : (
                            <img
                                src={`${url}/images/${r.logo}`}
                                alt="logo"
                                className="restaurant-logo-img"
                            />
                        )}


                        {editingId === r._id ? (
                            <>
                                <input name="name" value={editData.name} onChange={handleInputChange} />
                                <input name="resId" value={editData.resId} onChange={handleInputChange} />





                                <button className='custom-save-btn' onClick={saveChanges}>Save</button>
                                <button className='custom-cancel-btn' onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <p>{r.name}</p>
                                <p>{r.resId}</p>
                                <button className='custom-edit-btn' onClick={() => handleEdit(r)}>Edit</button>
                            </>
                        )}
                        <button onClick={() => removeRestaurant(r._id)} className="custom-remove-btn">Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;
