import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cartItems: {type: Object, default: {}}, // {productId: quantity}
}, {minimise:false})

const User = mongoose.models.user || mongoose.model("User", userSchema);

export default User;