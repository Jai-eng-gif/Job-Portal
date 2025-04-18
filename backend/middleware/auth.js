import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();     
const jwtAuthMiddleware =(req,res,next)=>{
    
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({error: 'No token provided'});
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        console.log(decoded);
        
        next();
        
    } catch (error) {
        console.log(error);        
        return res.status(401).json({error: 'Invalid token'});       
    }
}

const generateToken = (userData) => {
    const token = jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: '1h' });
    return token;
}


export {jwtAuthMiddleware,generateToken};