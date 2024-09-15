
import jwt from 'jsonwebtoken'

export const generateToken = async (userId,res)=>{
    const Token = jwt.sign({userId},process.env.JWT_SERCRET,{expiresIn: '15d'})

    res.cookie('jwt',Token,{
        maxAge: 15*24*60*1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development'
    })
}