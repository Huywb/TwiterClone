import express from 'express'
import { getMe, login, logout, signup } from '../controllers/AuthControllers.js'
import { protedRoute } from '../middleware/protedRoute.js'

const router = express.Router()



router.get("/me",protedRoute,getMe)
router.post('/register',signup)
router.post('/login',login)
router.post('/logout',logout)




export default router