import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
    console.log('All cookies received:', req.cookies);
    const {sellerToken } = req.cookies;
    console.log('SellerToken:', sellerToken);
    if (!sellerToken) {
        return res.status(401).json({success: false, message: 'Unauthorized access'});
    }
    try{

        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
        if(tokenDecode.email === process.env.SELLER_EMAIL){ 
            next();
        }else{
            return res.json({success: false, message: 'Unauthorized access'});
        }

    }catch(error){
        res.json({success: false, message: error.message}); 
    }

}

export default authSeller;