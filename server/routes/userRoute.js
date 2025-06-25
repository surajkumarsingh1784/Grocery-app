import express from 'express';
import { isAuth, login, logout, register } from '../controllers/userController.js';
import { updateCart } from '../controllers/cartController.js'; // Import the controller function
import authUser from '../middlewares/authUser.js'; // Ensure the user is authenticated

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/is-auth',authUser, isAuth);
userRouter.get('/logout', authUser, logout);

// Add the route for updating the cart
userRouter.post('/update', authUser, updateCart);

export default userRouter;