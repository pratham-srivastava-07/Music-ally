import express from "express"
import { userRouter } from "./user.js"
import getAllTracks from "../controllers/tracks.js"
import { trackRouter } from "./track.js"
import authMiddleware from "../middleware.js"

export const router = express.Router()

router.use("/user", userRouter)
// router.use("/create", authMiddleware, createRouter)

router.use('/tracks', authMiddleware, trackRouter)  // getting all tracks

