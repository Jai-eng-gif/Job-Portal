import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { User } from '../models/User.js';
dotenv.config();     

const jwtAuthMiddleware =async (req,res,next)=>{
    
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({error: 'No token provided'});
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);         
        req.user = decoded;
        console.log("decoded",decoded);
        
        
        next();
        
    } catch (error) {
        console.log(error);        
        return res.status(401).json({error: 'Invalid token'});       
    }
}

const generateToken = (userData) => {
    const token = jwt.sign({ user: userData }, process.env.SECRET_KEY, { expiresIn: '8h' });
    // console.log("token",token);
    
    return token;
}


export {jwtAuthMiddleware,generateToken};