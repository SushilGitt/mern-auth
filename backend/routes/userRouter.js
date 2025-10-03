import express from "express"
import { 
    getUser,
    login, 
    logout, 
    passReset, 
    register, 
    sendPassResetOtp, 
    sendVerifyOtp, 
    verifyEmail } from "../controllers/userController.js"
import authUser from "../middlewares/authUser.js"

const userRouter = express.Router()

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.post("/logout", logout)
userRouter.post("/send-verify-otp", authUser, sendVerifyOtp)
userRouter.post("/verify-email", authUser, verifyEmail)
userRouter.post("/send-pass-reset-otp", sendPassResetOtp)
userRouter.post("/pass-reset", passReset)
userRouter.get("/get-user", authUser, getUser)

export default userRouter