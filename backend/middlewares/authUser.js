import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"

const authUser = asyncHandler(async (req, res, next) => {
    
    const token = req.cookies.jwt

    if(!token) {
        res.status(401)
        throw new Error("Not authorized, no token!")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.id
    next()
})

export default authUser