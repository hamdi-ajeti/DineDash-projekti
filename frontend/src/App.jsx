import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import LandingPage from './pages/LandingPage/LandingPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackToStartButton from './components/BackToStartButton/BackToStartButton';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation(); // Hook to get the current location

  // Check if the current path is the LandingPage
  const isLandingPage = location.pathname === '/';

  return (
    <>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        {/* Conditionally render Navbar */}
        {!isLandingPage && <Navbar setShowLogin={setShowLogin} />}
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          {/*<Route path="/restaurant/:resId" element={<Home />} />*/} {/*optional*/}
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>

        <BackToStartButton/>
      </div>
      {/* Conditionally render Footer */}
      {!isLandingPage && <Footer />}
    </>
  );
};

export default App;