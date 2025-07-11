import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Address from '../models/Address.js'; // Import the Address model
import Stripe from 'stripe';

// Place order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        console.log("placeOrderCOD - userId:", userId); // Debug log

        if (!userId || !address || items.length === 0) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let amount = 0;

        // Calculate total amount
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
            }
            amount += product.offerPrice * item.quantity;
        }

        // Add tax (2%)
        amount += Math.floor(amount * 0.02);

        // Create the order
        const order = await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "COD",
        });

        console.log("placeOrderCOD - Order created with ID:", order._id, "for user:", userId); // Debug log
        res.status(201).json({ success: true, message: "Order placed successfully", order });
    } catch (error) {
        console.error("Error in placeOrderCOD:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

//place order stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;

        if (!userId || !address || items.length === 0) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let productData = [];
        let amount = 0;

        // Calculate total amount and prepare product data
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
            }
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            amount += product.offerPrice * item.quantity;
        }

        // Add tax (2%)
        amount += Math.floor(amount * 0.02);

        // Create the order
        const order = await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "Online",
        });

        // Initialize Stripe
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        // Create line items for Stripe
        const line_items = productData.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: { name: item.name },
                unit_amount: Math.floor(item.price * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

        // Create Checkout Session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: { orderId: order._id.toString(), userId },
        });

        res.json({ success: true, message: "Order placed successfully", url: session.url });
    } catch (error) {
        console.error("Error in placeOrderStripe:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Order by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.user; // Ensure `authUser` middleware sets `req.user`
        console.log("getUserOrders - userId:", userId); // Debug log

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Fetch orders and populate product details
        const orders = await Order.find({ userId })
            .populate('items.product') // Populate product details
            .sort({ createdAt: -1 });
        console.log("getUserOrders - Found orders:", orders.length); // Debug log

        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error in getUserOrders:", error.message); // Debugging log
        console.error("Error stack:", error.stack); // Full error details
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get All Orders (seller / admin) : /api/order/seller

export const getAllOrders = async (req, res) => {
    try{
        // Show all orders for seller dashboard (without address populate to avoid error)
        const orders = await Order.find({})
            .populate('items.product')
            .sort({createdAt: -1});
        
        console.log("getAllOrders - Found orders:", orders.length); // Debug log
        res.json({success: true, orders});
    } catch(error){
        console.log("Error in getAllOrders:", error.message);
        res.json({success: false, message: error.message});
    }
}