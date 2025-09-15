// import the framework to do our API
// using nodemon in package.json so the server refreshes everytime we have changes
import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";

dotenv.config();

// initialize the express instance
const app = express();
const PORT = process.env.PORT

// use middleware

// jsonfy the user req
app.use(express.json())

// standardise the route
app.use("/api/auth", authRoutes)



app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})
