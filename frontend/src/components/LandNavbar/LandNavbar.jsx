import React, { useState } from 'react'
import './LandNavbar.css'
import { assets } from '../../assets/assets'
import {Link, useNavigate} from 'react-router-dom'

const LandNavbar = () => {

  const [mobileMenu, setMobileMenu] = useState(false);
  const toggleMenu = () => {
    mobileMenu ? setMobileMenu(false) : setMobileMenu(true);
  }

  return (
    <nav className='container dark-nav'>
      <Link to="/"><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className={mobileMenu ? "" : "hide-mobile-menu"}>
        <a href='/#home'>Home</a>
        <a href='/#scrollrestaurants'>Restaurants</a>
        <a href='/#scrollabout'>About Us</a>
        <a href='/#scrollcontact'><button className='land-nav-btn'>Contact Us</button></a>
      </ul>
      <img src={assets.menu_icon} alt="" className='menu-icon' onClick={toggleMenu}/>
    </nav>
  )
}

export default LandNavbar
