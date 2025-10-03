import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRouter.js"
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js"


const app = express()
const port = process.env.PORT || 5000
connectDB()

const allowedOrigins = ["http://localhost:5173"]


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(cors({origin:allowedOrigins, credentials: true}))


// API endpoints
app.get("/", (req, res) => res.json({message: "Api is working!"}))
app.use("/api/users", userRouter)

// error handlers
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server is running on port: ${port}`))
