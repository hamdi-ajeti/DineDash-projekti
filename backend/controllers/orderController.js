import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174";

    try {
        const isDiscountApplied = req.body.isDiscountApplied || false;
        const subtotal = req.body.amount;
        const deliveryFee = 20;
        const discountedSubtotal = isDiscountApplied ? Math.round(subtotal * 0.9) : subtotal;
        const totalAmount = discountedSubtotal + deliveryFee;
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            status: 'Food Processing' // Initial status
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => {
            let price = item.price;
            if (isDiscountApplied) {
                price = Math.round(price * 0.9);  // Apply 10% discount
            }

            return {
                price_data: {
                    currency: "mkd",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: price * 100
                },
                quantity: item.quantity
            };
        });

        // Add delivery charges
        line_items.push({
            price_data: {
                currency: "mkd",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 20 * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// user orders for the frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// api to update order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// api to cancel order
const cancelOrder = async (req, res) => {
    try {
        const order = await orderModel.findById(req.body.orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        if (order.status === "Food Processing") {
            await orderModel.findByIdAndDelete(req.body.orderId);
            res.json({ success: true, message: "Order canceled" });
        } else {
            res.json({ success: false, message: "Order cannot be canceled at this stage" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await orderModel.findById(req.body.orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        if (order.status === "Delivered") {
            await orderModel.findByIdAndDelete(req.body.orderId);
            res.json({ success: true, message: "Order marked as collected and deleted" });
        } else {
            res.json({ success: false, message: "Only delivered orders can be marked as collected" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting order" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, cancelOrder, deleteOrder };
