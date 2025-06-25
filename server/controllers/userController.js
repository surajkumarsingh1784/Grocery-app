import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//Register User: /api/user/register
export const register = async (req, res) => {
    try{

        const {name, email, password} = req.body;
        
        if(!name || !email || !password){
            return res.json({success: false, message: 'Missing Details'})

        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.json({success: false, message: 'User already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production   
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiration time
        })

        return res.json({success: true, message: 'User registered successfully', user : {email: user.email, name: user.name}});

    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Login User: /api/user/login

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.json({success: false, message: 'Email and Password are required'});
        }
        const user = await User.findOne({email});

        if(!user){
            return res.json({success: false, message: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, message: 'Invalid email or password'});
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production   
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiration time
        })

        return res.json({success: true, message: 'User logged in  successfully', user : {email: user.email, name: user.name}});
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});

    }
}

//check Auth : /api/user/is-auth

export const isAuth = async (req, res) => {
     try {
        // Ensure req.user exists
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No user information found' });
        }

        const { userId } = req.user; // Access userId from req.user
        const user = await User.findById(userId).select('-password'); // Fetch user details from DB

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

//Logout User: /api/user/logout
export const logout = async (req, res)=> {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production   
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict', // CSRF protection
        })
        res.json({success: true, message: 'User logged out successfully'});

    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});

    }
}

