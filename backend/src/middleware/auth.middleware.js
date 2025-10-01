import jwt from "jsonwebtoken"
import User from "../models/User.js"

export async function protectRoute(req, res, next) {
    try {
        // get the token from the cookie
        // cookie contains key-value pairs
        // key here is "jwt", value is the token
        const token = req.cookies.jwt
        
        // validate the token
        if(!token){
            return res.status(401).json({message: "Unauthorized - No token provided"})
        }

        // verify the token
        // .verify will decode the token and verify with process.env.JWT_SECRET_KEY
        // if not verified, it will throw an error
        // if verified, it will return the decoded payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (!decoded){
            return res.status(401).json({message: "Unauthorized - Invalid token"})
        }

        // get the user from the decoded payload
        const user = await User.findById(decoded.userId).select("-password") // remove the password field

        if(!user){
            return res.status(401).json({message: "Unauthorized - User not found"})
        }

        req.user = user // attach the user to the req object

        next() // pass the control to the next middleware or controller

        
    } catch (error) {
        console.log("Error in protectRoute middleware", error)
        return res.status(401).json({message: "Internal server error"})
    }
}