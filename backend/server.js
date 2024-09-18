import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/Auth.js'
import userRoutes from './routes/User.js'
import postRoutes from './routes/Post.js'
import notificationRoutes from './routes/Notification.js'
import cloudinary from 'cloudinary'
import { ConnectDB } from './DB/Connect.js'
import cookieParser from 'cookie-parser'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SERCRET
})


const app = express()
app.use(express.json())
app.use(cookieParser())


app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/post',postRoutes)
app.use('/api/notification',notificationRoutes)


app.listen(8000,()=>{
    console.log('Server is running port 8000')
    ConnectDB()
})
