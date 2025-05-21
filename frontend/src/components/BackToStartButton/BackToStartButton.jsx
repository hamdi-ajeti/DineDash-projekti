import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './BackToStartButton.css';

const BackToStartButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useContext(StoreContext);

  const handleBackAndLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  if (location.pathname !== '/home') return null;

  return (
    <button className="back-button" onClick={handleBackAndLogout}>
      ⬅ Back to Restaurant Selection
    </button>
  );
};

export default BackToStartButton;
