import Notification from "../models/Notification.js"

export const getNotification = async(req,res)=>{
    try {
        const userId = req.user._id

        const notification = await Notification.find({to: userId}).populate({
            path: 'from',
            select: 'username profile'
        })

        await Notification.updateMany({to: userId},{read:true})

        res.status(200).json(notification)
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
}

export const deleteNotification = async(req,res)=>{
    try {
        const userId = req.user._id

        await Notification.deleteMany({to: userId})
        
        res.status(200).json({message:"Notification delete successfully"})
    } catch (error) {
        
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
}

export const deleteIdNotification = async(req,res)=>{

    const userId = req.user._id
    const notiId = req.params.id
    try {
        const notification = await Notification.findById(notiId)

        if(!notification){
            return res.status(400).json({message:"Cannot find notification"})
        }

        if(notification.to.toString() !== userId.toString()){
            return res.status(400).json({message:"Not Authorized"})
        }

        await Notification.findByIdAndDelete(notiId)

        res.status(200).json({message:"Delete Notification successfully"})
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"Internal Server Error"})
    }
}