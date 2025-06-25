import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Address from '../models/Address.js'; // Import the Address model
import Stripe from 'stripe';

// Place order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

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

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Fetch orders and populate product and address fields
        const orders = await Order.find({ userId })
            .populate('items.product') // Populate product details
            .populate('address') // Populate address details
            .sort({ createdAt: -1 }); // Sort by most recent orders

        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error in getUserOrders:", error.message); // Debugging log
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get All Orders (seller / admin) : /api/order/seller

export const getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find({
            $or: [{paymentType: 'COD'}, {isPaid:true}]
        }).populate('items.product address').sort({createdAt: -1});
        res.json({success: true, orders});
    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}