import asyncHandler from "express-async-handler"
import "dotenv/config"
import crypto from "crypto"
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"
import sgMail from "@sendgrid/mail"
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js"

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Register user
const register = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body

    // if any value is missing?
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("All fields are required!")
    }

    // if user already registered?
    const alreadyUser = await User.findOne({ email })

    if (alreadyUser) {
        res.status(409)
        throw new Error("User already exists!")
    }

    // create new user with provided values
    const user = await User.create({ name, email, password })

    if (user) {

        // Send cookie 
        const token = generateToken(user._id)

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // send welcome email to user
        const msg = {
            from: process.env.SENDGRID_SENDER,
            to: email,
            subject: "Welcome to Mern-Auth",
            text: `Welcome to our website. Your account has been created with email: ${email}`
        }

        await sgMail.send(msg)

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: "User registered successfully!"
        })
    }
    else {
        res.status(500)
        throw new Error("Something went wrong!")
    }
})

// Login user
const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    // if any value is missing?
    if (!email || !password) {
        res.status(400)
        throw new Error("Email and Password are required!")
    }

    const user = await User.findOne({ email })
    // if user exists and password matched?
    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id)
        // sending cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        // sending logged in user info
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: "User logged in successfully!"
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid email or password!")
    }
})

// Logout user
const logout = asyncHandler(async (req, res) => {

    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    })

    res.status(200).json({ message: "User logged out successfully!" })
})

// Send email verify otp
const sendVerifyOtp = asyncHandler(async (req, res) => {

    const userId = req.user

    const user = await User.findById(userId)

    if (user.isAccountVerified) {
        res.status(400).json({
            message: "Account already verified!"
        })
    }

    const otp = String(crypto.randomInt(0, 1000000)).padStart(6, "0")

    user.verifyOtp = otp
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

    await user.save()

    const msg = {
        from: process.env.SENDGRID_SENDER,
        to: user.email,
        subject: "Account Verification",
        html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    }

    await sgMail.send(msg)

    res.status(200).json({
        message: "Verification OTP sent on email!"
    })
})

// Verify user email
const verifyEmail = asyncHandler(async (req, res) => {

    const userId = req.user
    const { otp } = req.body;

    if (!userId || !otp) {
        res.status(400)
        throw new Error("Missing details!")
    }

    const user = await User.findById(userId)

    if (!user) {
        res.status(400)
        throw new Error("User not found!")
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
        res.status(400)
        throw new Error("Invalid OTP!")
    }

    if (user.verifyOtpExpireAt < Date.now()) {
        res.status(400)
        throw new Error("OTP expired!")
    }

    user.isAccountVerified = true
    user.verifyOtp = ""
    user.verifyOtpExpireAt = 0

    await user.save()

    res.status(200).json({
        message: "Email is verified!"
    })
})

// Send password reset otp
const sendPassResetOtp = asyncHandler(async (req, res) => {

    const { email } = req.body

    if (!email) {
        res.status(400)
        throw new Error("Email is required!")
    }

    const user = await User.findOne({ email })

    if (!user) {
        res.status(404)
        throw new Error("User not found!")
    }

    const otp = String(crypto.randomInt(0, 1000000)).padStart(6, "0")

    user.resetOtp = otp
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

    await user.save()

    const msg = {
        from: process.env.SENDGRID_SENDER,
        to: email,
        subject: "Password reset OTP!",
        html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", email)
    }

    await sgMail.send(msg)

    res.status(200).json({
        message: "OTP sent to your email!"
    })
})

// Reset user password
const passReset = asyncHandler(async (req, res) => {

    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
        res.status(400)
        throw new Error("All feilds are required!")
    }

    const user = await User.findOne({ email })

    if (!user) {
        res.status(404)
        throw new Error("User not found!")
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
        res.status(400)
        throw new Error("Invalid OTP!")
    }

    if (user.resetOtpExpireAt < Date.now()) {
        res.status(400)
        throw new Error("OTP expired!")
    }

    user.password = newPassword
    user.resetOtp = "";
    user.resetOtpExpireAt = 0

    await user.save()

    res.status(200).json({
        message: "Password reset success!"
    })

})

// Get user details
const getUser = asyncHandler(async (req, res) => {

    const userId = req.user

    const user = await User.findById(userId)

    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }

    res.status(200).json({
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified
    })
})


export {
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyEmail,
    sendPassResetOtp,
    passReset,
    getUser
}