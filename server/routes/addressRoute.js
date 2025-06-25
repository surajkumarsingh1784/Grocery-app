import express from 'express';
import authUser from '../middlewares/authUser.js';
import { addAddress, getAddress } from '../controllers/addressController.js';

const addressRouter = express.Router();

// Correctly define the routes
addressRouter.post('/add', authUser, addAddress); // For adding an address
addressRouter.get('/get', authUser, getAddress); // For retrieving addresses

export default addressRouter;