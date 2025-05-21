import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const { url, isDiscountApplied, getTotalCartAmount } = useContext(StoreContext);
    const navigate = useNavigate();

    const deliveryFee = getTotalCartAmount() === 0 ? 0 : 20;
    const subtotal = getTotalCartAmount();
    const discountedSubtotal = isDiscountApplied ? Math.round(subtotal * 0.9) : subtotal;
    const totalAmount = discountedSubtotal + deliveryFee;

    const verifyPayment = async () => {
        const response = await axios.post(url + "/api/order/verify", {
            success,
            orderId,
            //totalAmount, // optional: pass this if backend needs it
        });
        if (response.data.success) {
            navigate("/myorders");
        } else {
            navigate("/home");
        }
    };

    useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;
