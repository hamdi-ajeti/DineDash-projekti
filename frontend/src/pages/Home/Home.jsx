import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const resId = location.state?.resId || localStorage.getItem("resId"); // <-- updated line

  const [category, setCategory] = useState("All");

  return (
    <div className='home'>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay restaurantId={resId} category={category} />
    </div>
  );
};

export default Home;
