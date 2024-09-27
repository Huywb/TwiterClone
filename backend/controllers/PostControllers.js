import Post from "../models/Post.js"
import User from "../models/User.js"
import cloudinary from 'cloudinary'
import Notification from '../models/Notification.js'


export const getAllPosts = async(req,res)=>{
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: 'user',
            select: '-password'
        }).populate({
            path: 'comments.user',
            select: '-password'
        })

        if(posts.length === 0 ){
            return res.status(200).json([])
        }

        res.status(200).json(posts)
    } catch (error) {
        
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
}
export const createPost = async(req,res)=>{
    try {
        
        const { text } = req.body
        let { img } = req.body
        const userId = req.user._id.toString()
        console.log('abc')

        const user = await User.findById(userId)

        if(!user){
            return res.status(400).json({message:"Cannot find user"})
        }

        if(!text && !img){
            return res.status(400).json({message:"Post must be have text and image"})
        }

        if(img){
            const uploadImg = await cloudinary.v2.uploader.upload(img)
            img = uploadImg.secure_url
        }

        const newPost = new Post({
            user : userId,
            text,
            img,
        })

        await newPost.save()
        

        res.status(200).json(newPost)
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
}

export const likeUnlikePost = async(req,res)=>{
    try {
        const userId = req.user._id
        const postId = req.params.id

        const post = await Post.findById(postId)

        if(!post){
            return res.status(400).json({message:"Cannot find post"})
        }

        if(!userId){
            return res.status(400).json({message:"Cannot find user"})
        }

        if(post.likes.includes(userId)){
            await Post.updateOne({_id: postId},{$pull:{likes: userId}})
            await User.updateOne({_id: userId},{$pull:{likedPost: postId}})
            res.status(200).json({message:"Post unlike successfully"})
        } else{
            post.likes.push(userId)
            await User.updateOne({_id: userId},{$push:{likedPost: postId}})
            await post.save()

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: 'like'
            })
            await notification.save()
            res.status(200).json({message:"Post liked successfully"})

        }
        
    } catch (error) {
        
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
}

export const commentPost = async(req,res)=>{
    try {

        const {text} = req.body
        const postId = req.params.id
        const userId = req.user._id

        if(!text){
            return res.status(400).json({message:"Text is required"})
        }

        const post = await Post.findById(postId)

        if(!post){
            return res.status(400).json({message:"Cannot find post"})
        }

        const comment = {user: userId, text}    

        post.comments.push(comment)

        await post.save()

        res.status(200).json(post)
        
    } catch (error) {
        
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
}

export const deletePost = async(req,res)=>{

    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(400).json({message:"Cannot find post"})
        }

        if(post.user._id != req.user._id.toString()){
            return res.status(400).json({message:"You not authorized of post"})
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.v2.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(req.params.id)

        res.status(200).json({message:"Delete post successfully"})

    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
}

export const getLikedPosts = async(req,res)=>{
    const userId = req.params.id
    try {

        if(!userId){
            return res.status(400).json({message:"Cannot find user"})
        }
        const UserPost = await User.findById(userId).populate('likedPost')

        if(!UserPost){
            return res.status(400).json({message:"Cannot get post of user"})
        }

        res.status(200).json(UserPost)

    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
}

export const getFollowingPosts = async(req,res)=>{
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({message:"Cannot find user"})
        }

        const following = user.following

        const feedPost = await Post.find({user: {$in: following}}).sort({createAt: -1})
        .populate({
            path: 'user',
            select: '-password'
        }).populate({
            path: 'comments.user',
            select: '-password'
        })

        res.status(200).json(feedPost)
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
}

export const getUserPosts = async(req,res)=>{
    
    const username = req.params.username
    try {
        const user = await User.findOne({username})

        if(!user){
            return res.status(400).json({message:"Cannot find user"})
        }

        const userPost = await Post.find({user: user._id}).sort({createAt: -1})
        .populate({
            path: 'user',
            select: '-password'
        })
        .populate({
            path: 'comments.user',
            select: '-password'
        })

        res.status(200).json(userPost)
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
}