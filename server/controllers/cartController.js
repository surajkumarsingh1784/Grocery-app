import User from "../models/User.js";

export const updateCart = async (req, res) => {
    try {
        const { userId, cartItems } = req.body;

        if (!userId || !cartItems) {
            return res.json({ success: false, message: "Missing userId or cartItems" });
        }

        // Update the user's cartItems in the database
        const user = await User.findByIdAndUpdate(
            userId,
            { cartItems },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Cart updated successfully", cartItems: user.cartItems });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};