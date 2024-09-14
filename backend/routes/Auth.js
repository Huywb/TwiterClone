import express from 'express'

const router = express.Router()


router.get('/register',(req,res)=>{
    res.json("abc")
})
router.get('/login',(req,res)=>{
    res.json("abc")
})
router.get('/logout',(req,res)=>{
    res.json("abc")
})




export default router