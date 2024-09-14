import User from "../models/User"
import bcrypt from 'bcryptjs'

export const signup = async (req,res)=>{
    try {
        const {fullName, username, email, password} = req.body
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        if(!emailRegex.test(email)){
            return res.status(400).json({message:" Invalid email format"})
        }

        const existingUser = await User.findOne(username)
        const existingEmail = await User.findOne(email)

        if(existingUser){
            res.status(400).json({message: "Username already exist"})
        }
        if(existingEmail){
            res.status(400).json({message: "Email already exist"})
        }

        const salt = await bcrypt.genSalt(10)
        const HashPass = await bcrypt.hash(password,salt)

        const newUser = await User.create({
            username,
            email,
            fullName,
            password: HashPass
        })
    } catch (error) {
        console.log(error)
    }
}