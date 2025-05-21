import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img className="footer-logo" src={assets.new_vintage} alt="" />
            <p>We’re here to make your food experience easy, satisfying, and stress-free. Questions or feedback? Reach out anytime — we love hearing from you.</p>
            <div className="footer-social-items">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>Company</h2>
            <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>Get in touch</h2>
            <ul>
                <li>+389-78-318-895</li>
                <li>hamdi100junior@gmail.com</li>
            </ul>
        </div>
        
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 &copy; DineDash.com - All Rights Reserved.</p>
    </div>
  )
}

export default Footer
