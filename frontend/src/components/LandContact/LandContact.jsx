import React from 'react'
import './LandContact.css'
import { assets } from '../../assets/assets'

const LandContact = () => {

    const [result, setResult] = React.useState("");

    const onSubmit = async (event) => {
      event.preventDefault();
      setResult("Sending....");
      const formData = new FormData(event.target);
  
      formData.append("access_key", "fd780805-7532-4159-91c0-4c08860d0a3d");
  
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
  
      const data = await response.json();
  
      if (data.success) {
        setResult("Form Submitted Successfully");
        event.target.reset();
      } else {
        console.log("Error", data);
        setResult(data.message);
      }
    };

  return (
    <div className='contact' id='contact'>
      <div className="contact-col">
        <h3>Send us a message <img src={assets.msg_icon} alt="" /></h3>
        <p>Feel free to reach out to us through the provided contact form. 
            Your feedback, questions, and suggestions are important to us as we strive to provide
            an exeptional service to our customers.</p>
        <ul>
            <li><img src={assets.mail_icon} alt="" />hamdi100junior@gmail.com</li>
            <li><img src={assets.phone_icon} alt="" />+389-78-318-895</li>
            <li><img src={assets.location_icon} alt="" />Proleterski Brigadi br.1</li>
        </ul>
      </div>
      <div className="contact-col">
        <form onSubmit={onSubmit}>
            <label >Your name</label>
            <input type="text" name='name' placeholder='Enter your name' required />
            <label>Phone Number</label>
            <input type="tel" name='phone' placeholder='Enter your phone number' required />
            <label>Write your message</label>
            <textarea name="message" rows="6" placeholder='Enter your message' required></textarea>
            <button type='submit' className='btn-dark'>Submit now <img src={assets.white_arrow} alt="" />
            </button>
        </form>
        <span>{result}</span>
      </div>
    </div>
  )
}

export default LandContact
