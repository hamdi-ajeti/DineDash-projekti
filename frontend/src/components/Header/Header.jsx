import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your favorite food here</h2>
        <p>Craving something delicious? Dine Dash brings your favorite meals straight to your door — fast, fresh, and full of flavor. Good food is just a few taps away. Enjoy!</p>
        <a href="#explore-menu"><button>View Menu</button></a>
      </div>
    </div>
  )
}

export default Header
