import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product is required"], // Ensure `product` is required
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required"],
                min: [1, "Quantity must be at least 1"],
            },
        },
    ],
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: [true, "Address is required"],
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
    },
    paymentType: {
        type: String,
        enum: ["COD", "Online"],
        required: [true, "Payment type is required"],
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Cancelled"],
        default: "Pending",
    },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;