import React, { useEffect, useState } from 'react';
import './Restaurants.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Restaurants = ({ url }) => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${url}/api/restaurant/list`);
      if (res.data.success) {
        setRestaurants(res.data.data);
      } else {
        console.error('Failed to fetch restaurants');
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className='restaurants' id='restaurants'>
      {restaurants.map((r) => (
        <div
          className="restaurant"
          key={r._id}
          onClick={() => {
            window.scrollTo(0, 0);
            localStorage.setItem("resId", r._id); // 👈 store resId persistently
            navigate('/home', { state: { resId: r._id } }); // 👈 optional but helpful
          }}
        >
          <img
            className='restaurant-img'
            src={`${url}/images/${r.image}`}
            alt={r.name}
          />
          <div className="caption">
            <img
              src={`${url}/images/${r.logo}`}
              alt={`${r.name} logo`}
            />
            <p>{r.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Restaurants;
