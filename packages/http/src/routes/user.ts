import express from "express"
import signupRoute from "../controllers/user.js"

export const userRouter = express.Router()

userRouter.use("/signup", signupRoute)