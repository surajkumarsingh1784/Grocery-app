import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required'],
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    street: {
        type: String,
        required: [true, 'Street is required'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
    },
    state: {
        type: String,
        required: [true, 'State is required'],
    },
    zipcode: {
        type: Number,
        required: [true, 'Zipcode is required'],
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
    },
});

const Address = mongoose.models.address || mongoose.model('address', addressSchema);

export default Address;