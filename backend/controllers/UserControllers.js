import Notification from "../models/Notification.js"
import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import cloudinary from 'cloudinary'


export const getUserProfile = async(req,res)=>{
    const {username} = req.params
    try {
        const user = await User.findOne({username}).select('-password')

        if(!user){
           return res.status(400).json({message:"Cannot find user"})
        }

        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})

    }
}

export const followUnfollowUser = async(req,res)=>{
    try {
        const {id} = req.params

        const UserToModify = await User.findById(id)

        const currentUser = await User.findById(req.user._id)


        if(id === req.user._id.toString()){
            return res.status(400).json({message:"You cannot follow/unfollow yourself"})
        }

        if(!UserToModify || !currentUser){
            return res.status(400).json({message:"User not found"})
        }

        const isFollowing = currentUser.following.includes(id)

        if(isFollowing){
            await User.findByIdAndUpdate(id,{
                $pull:{
                    followers: req.user._id
                }
            })

            await User.findByIdAndUpdate(req.user._id,{
                $pull:{
                    following: id
                }
            })

            return res.status(200).json({message:"Unfollow successfull"})
        }else{
            await User.findByIdAndUpdate(id,{
                $push:{
                    followers: req.user._id
                }
            })

            await User.findByIdAndUpdate(req.user._id,{
                $push:{
                    following: id
                }
            })

            const newNotification = new Notification({
                type: 'follow',
                from: req.user._id,
                to: UserToModify._id

            })

            await newNotification.save()
            return res.status(200).json({message:"Follow successfull"})

        }


    } catch (error) {
        
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}


export const getSuggetedUser = async(req,res)=>{
    try {
        const userId = req.user._id

        const usersFollowedMe = await User.findById(userId).select('following')

        const users = await User.aggregate([
            {
                $match:{
                    _id: {$ne: userId}
                },
            },
            {$sample: {size: 10}}
        ])

        const filteredUser = users.filter((user)=>!usersFollowedMe.following.includes(user._id))

        const suggetedUser = filteredUser.slice(0,4)

        suggetedUser.forEach((user)=>(user.password = null))

        res.status(200).json(suggetedUser)


    } catch (error) {
        
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const updateUser = async(req,res)=>{
    
    const {fullName, email,username, currentPassword, newPassword,bio,link} = req.body
    let {profileImg,coverImg} = req.body

    const userId = req.user._id

    try {
        let user = await User.findById(userId)
        if(!user) {
            return res.status(400).json({message:"Cannot find user"})
        }

        if((!currentPassword && newPassword) || (!newPassword && currentPassword)){
            return res.status(400).json({message:'Please provide both password and new password'})
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword,user.password)
            if(!isMatch){
                return res.status(400).json({message:"This password not correct"})
            }
            
            if(newPassword.length < 6){
                return res.status(400).json({message:"Password must be at least 6 charactor"})
            }


            const salt =await bcrypt.genSalt(10)
            user.password =await bcrypt.hash(newPassword,salt)
        }

        if(profileImg){

            if(user.profileImg){
                await cloudinary.v2.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
            }
           const imgUpload =  await cloudinary.v2.uploader.upload(profileImg)
           profileImg = imgUpload.secure_url
        }

        if(coverImg){

            if(user.coverImg){
                await cloudinary.v2.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
            }
           const imgUpload =  await cloudinary.v2.uploader.upload(profileImg)
           coverImg = imgUpload.secure_url
        }

        user.fullName = fullName || user.fullName
        user.email = email || user.email
        user.username = username || user.username
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        user = await user.save()

        user.password = null
        res.status(200).json(user)

    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
}