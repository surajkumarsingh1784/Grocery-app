import Address from '../models/Address.js';

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { address } = req.body;

        // Validate required fields
        if (!address.userId || !address.firstName || !address.lastName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, firstName, or lastName',
            });
        }

        // Create the address in the database
        await Address.create(address);
        res.status(201).json({ success: true, message: 'Address added successfully' });
    } catch (error) {
        console.error('Error in addAddress:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Address : /api/address/get
export const getAddress = async (req, res) => {
    try {
        const { userId } = req.user; // Use `req.user` from the `authUser` middleware
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const addresses = await Address.find({ userId });
        res.json({ success: true, addresses });
    } catch (error) {
        console.error('Error in getAddress:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
