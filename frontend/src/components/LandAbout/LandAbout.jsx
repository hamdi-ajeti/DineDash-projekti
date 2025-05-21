import React from 'react'
import './LandAbout.css'
import { assets } from '../../assets/assets'

const LandAbout = () => {
  return (
    <div className='about' id='about'>
      <div className="about-left">
        <img src={assets.logo} alt="" className='about-img' />
      </div>
      <div className="about-right">
        <h3>About "Dine Dash"</h3>
        <h2>A Platform for Food Lovers Everywhere</h2>
        <p>Welcome to Dine Dash, your go-to platform for seamless and satisfying food ordering experiences.
           Whether you're craving comfort food, exploring new cuisines, or planning a cozy dinner at home, we've got you covered.</p>
        <p>At Dine Dash, we believe food is more than just sustenance—it's an experience.
           That’s why we’ve partnered with your favorite local restaurants, cafés, and food trucks to bring delicious meals to your doorstep, fresh and fast.</p>
        <p>Our Mission is to make food ordering simple, enjoyable, and accessible for everyone while empowering local restaurants to thrive in a digital world.
           Thank you for choosing Dine Dash. Let’s make every meal memorable!
        </p>
      </div>
    </div>
  )
}
import './LandAbout.css'

export default LandAbout
