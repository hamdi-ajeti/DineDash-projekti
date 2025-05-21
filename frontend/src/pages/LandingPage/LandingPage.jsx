import React from 'react'
import './LandingPage.css'
import { useNavigate } from 'react-router-dom';
import LandNavbar from '../../components/LandNavbar/LandNavbar';
import Hero from '../../components/Hero/Hero';
import Restaurants from '../../components/Restaurants/Restaurants';
import Title from '../../components/Title/Title';
import LandAbout from '../../components/LandAbout/LandAbout';
import LandContact from '../../components/LandContact/LandContact';
import LandFooter from '../../components/LandFooter/LandFooter';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
    <LandNavbar></LandNavbar>
    <Hero></Hero>
    <div className='container'>
      <Title subTitle=' ' title=' ' ></Title>
      <Title subTitle='Our partnered restaurants are listed below.' title='What we offer' scroll_id='scrollrestaurants'></Title>
      <Restaurants url="http://localhost:4000" />
      <Title subTitle=' ' title=' ' scroll_id='scrollabout'></Title>
      <Title subTitle='More Comming soon...' title=' '></Title>
      <LandAbout></LandAbout>
      <Title subTitle='Contact Us' title='Get in Touch' scroll_id='scrollcontact'></Title>
      <LandContact></LandContact>
      <LandFooter></LandFooter>
    </div>
    
   
    </>
    
  );
}

export default LandingPage
