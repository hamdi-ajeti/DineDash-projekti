import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
    };

    const cancelOrder = async (orderId) => {
        try {
            await axios.post(
                `${url}/api/order/cancel`,
                { orderId },
                { headers: { token } }
            );
            toast.success("Order canceled successfully!");
            fetchOrders(); // Refresh orders after cancellation
        } catch (error) {
            console.error("Failed to cancel order:", error);
            toast.error("Failed to cancel order. Please try again.");
        }
    };

        const deleteCollectedOrder = async (orderId) => {
        try {
            await axios.post(`${url}/api/order/delete`, { orderId }, { headers: { token } });
            toast.success("Thank you for choosing us, Enjoy your meal.");
            fetchOrders();
        } catch (error) {
            toast.error("Something went wrong!.");
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <ToastContainer /> {/* Add ToastContainer */}
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt="" />
                        <p>
                            {order.items.map((item, index) => (
                                index === order.items.length - 1
                                    ? item.name + " x " + item.quantity
                                    : item.name + " x " + item.quantity + ", "
                            ))}
                        </p>
                        <p>{order.amount}.00 mkd</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                        <button className='track-btn' onClick={fetchOrders}>Track Order</button>
                        {order.status === "Food Processing" && (
                            <button className='cancel-btn' onClick={() => cancelOrder(order._id)}>Cancel Order</button>
                        )}
                        {order.status === "Delivered" && (
                            <button className='collect-btn' onClick={() => deleteCollectedOrder(order._id)}>Collect</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
