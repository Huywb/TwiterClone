import express from 'express'
import {  protedRoute } from '../middleware/protedRoute.js'
import { followUnfollowUser, getSuggetedUser, getUserProfile, updateUser } from '../controllers/UserControllers.js'

const router = express.Router()



router.get('/profile/:username',protedRoute,getUserProfile)
router.get('/suggeted',protedRoute,getSuggetedUser)
router.post('/follow/:id',protedRoute,followUnfollowUser)
router.post('/update',protedRoute,updateUser)

export default router