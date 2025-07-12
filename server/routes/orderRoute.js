import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD); // For COD orders
orderRouter.get('/user', authUser, getUserOrders); // For user orders
orderRouter.get('/seller', authSeller, getAllOrders); // For seller orders (changed to GET)
orderRouter.post('/stripe', authUser, placeOrderStripe); // For Stripe orders

export default orderRouter;