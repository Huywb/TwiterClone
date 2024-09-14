import mongoose from "mongoose";


export const ConnectDB = async(req,res)=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Mongoose Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}