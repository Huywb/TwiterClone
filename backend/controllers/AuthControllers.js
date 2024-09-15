import { generateToken } from "../libs/utils/generateToken.js"
import User from "../models/User.js"
import bcrypt from 'bcryptjs'

export const signup = async (req,res)=>{
    try {
        const {fullName, username, email, password} = req.body
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        if(!emailRegex.test(email)){
            return res.status(400).json({message:" Invalid email format"})
        }

        const existingUser = await User.findOne({username})
        const existingEmail = await User.findOne({email})

        if(existingUser){
            res.status(400).json({message: "Username already exist"})
        }
        if(existingEmail){
            res.status(400).json({message: "Email already exist"})
        }

        if(password.length < 6){
            res.status(400).json({message: "Password must be as least 6 characters long"})
        }

        const salt = await bcrypt.genSalt(10)
        const HashPass = await bcrypt.hash(password,salt)

        const newUser =new User({
            username,
            email,
            fullName,
            password: HashPass
        })

        if(newUser){    
            generateToken(newUser._id,res)
            await newUser.save()

            res.status(200).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
            })
        }else{
            res.status(400).json({message:"Invalid user data"})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const login = async(req,res)=>{
    try {
        const {username,password} = req.body
        const user = await User.findOne({username})

        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "")

        if(!user || !isPasswordCorrect){
            return res.status(400).json({message:"Invalid user or password"})
        }

        generateToken(user._id,res)

        res.status(200).json({
            _id:user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                followers: user.followers,
                following: user.following,
                profileImg: user.profileImg,
                coverImg: user.coverImg
        })
    } catch (error) {
        
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const logout = async(req,res)=>{
    try {
        
        res.cookie('jwt','',{maxAge:0})
        res.status(200).json({message: "Logout successfull"})
    } catch (error) {
        
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const getMe = async(req,res)=>{
    try {
        
        const user = await User.findById(req.user._id).select("-password")

        res.status(200).json(user)
    } catch (error) {
        
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}