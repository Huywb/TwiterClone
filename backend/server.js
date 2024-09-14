import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/Auth.js'
import { ConnectDB } from './DB/Connect.js'

dotenv.config()

const app = express()
app.use(express.json())


app.use('/api/auth',authRoutes)


app.listen(8000,()=>{
    console.log('Server is running port 8000')
    ConnectDB()
})
