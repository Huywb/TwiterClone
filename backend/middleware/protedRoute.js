import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protedRoute = async(req,res,next)=>{
    try {
        
        const token = req.cookies.jwt

        if(!token){
            return res.status(400).json({message:'Unauthorized'})
        }

        const decoded = jwt.verify(token,process.env.JWT_SERCRET)

        if(!decoded){
            return res.status(400).json({message:"Invalid token"})
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(400).json({message:"User not find"})
        }

        req.user = user
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}