import express from "express"
import cors from "cors" 
// import prismaClient from "@repo/db/client"
import { router } from "./routes/index.js"

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/v1", router)

app.get('/', (req, res) => {
    res.send("Hello")
})



app.listen(5000, () => {
    console.log("http server recreated");
    
})