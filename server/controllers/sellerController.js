

//Login Seller : /api/seller/login

import jwt  from "jsonwebtoken";

export const sellerLogin = async (req , res) => {
    const {email, password} = req.body;

   try{
    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token = jwt.sign({email}, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: true, // Always use secure cookies in production
            sameSite: 'None', // Required for cross-origin cookies
            maxAge: 7 * 24 * 60 * 60 * 1000,
            domain: undefined // Let browser handle domain
        })

        return res.json({success: true, message: 'Seller logged in successfully'});
    } else{
        return res.json({success: false, message: 'Invalid Credentials'});
    }

   }catch(error){
    console.log(error.message);
    res.json({success: false, message: error.message});
   }
}
   //Seller isAuth : /api/seller/is-auth

export const isSellerAuth = async (req, res) => {
    try {
       

       return res.json({ success: true });
   } catch (error) {
       console.error(error.message);
       res.status(500).json({ success: false, message: 'Internal Server Error' });
   }
};
    
    
    
//Logout Seller : /api/seller/logout


export const sellerLogout = async (req, res)=> {
    try{
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        })
        res.json({success: true, message: 'Seller logged out successfully'});

    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});

    }
}