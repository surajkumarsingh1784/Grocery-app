import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: Array, required: true},
    price: {type: Number, required: true},
    offerPrice: {type: Number, required: true},
    image: {type: Array, required: true},
    category: {type: String, required: true},
    cartItems: {type: Object}, // {productId: quantity}

    inStock: {type: Boolean, default: true}, // {productId: quantity}
}, {timestamps: true})

const Product = mongoose.models.product || mongoose.model("Product", productSchema);

export default Product;