import express from 'express'
import { protedRoute } from '../middleware/protedRoute.js'
import { deleteIdNotification, deleteNotification, getNotification } from '../controllers/NotificationControllers.js'

const router = express.Router()


router.get("/",protedRoute,getNotification)
router.delete("/",protedRoute,deleteNotification)
router.delete("/:id",protedRoute,deleteIdNotification)

export default router