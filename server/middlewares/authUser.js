import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    console.log('All cookies in authUser:', req.cookies); // Debug log
    const { token } = req.cookies;
    console.log('Token found:', token); // Debug log

    if (!token) {
        console.log('No token provided'); // Debug log
        return res.status(401).json({ success: false, message: "Unauthorized access: No token provided" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decodedToken.id }; // Set `req.user` with `userId`
        next();
    } catch (error) {
        console.error("Error in authUser middleware:", error.message);
        res.status(401).json({ success: false, message: "Unauthorized access: Invalid token" });
    }
};

export default authUser;