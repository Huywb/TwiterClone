import express from 'express'
import { protedRoute } from '../middleware/protedRoute.js'
import { commentPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from '../controllers/PostControllers.js'

const router = express.Router()


router.get("/all",protedRoute,getAllPosts)
router.get("/following",protedRoute,getFollowingPosts)
router.get("/likes/:id",protedRoute,getLikedPosts)
router.get("/user/:username",protedRoute,getUserPosts)
router.post("/create",protedRoute,createPost)
router.post("/like/:id",protedRoute,likeUnlikePost)
router.post("/comment/:id",protedRoute,commentPost)
router.delete("/:id",protedRoute,deletePost)


export default router