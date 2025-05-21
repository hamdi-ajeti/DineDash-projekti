import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UsersList from './pages/UsersList/UsersList'
import AddRestaurant from './pages/AddRestaurant/AddRestaurant' // 💡 make sure this path is correct
import RestaurantList from './pages/ListRestaurant/ListRestaurant';
import AddUsers from './pages/AddUsers/AddUsers'

const App = () => {

  const url = "http://localhost:4000"

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path='/add' element={<Add url={url} />} />
          <Route path='/list' element={<List url={url} />} />
          <Route path='/user' element={<UsersList url={url} />} />
          <Route path='/orders' element={<Orders url={url} />} />
          <Route path='/add-restaurant' element={<AddRestaurant url={url} />} />
          <Route path='/restaurant-list' element={<RestaurantList url={url} />} />
          <Route path="/add-user" element={<AddUsers url={url} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
