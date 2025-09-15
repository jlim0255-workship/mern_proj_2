import User from "../models/User.js"
import jwt from "jsonwebtoken"

export async function signup(req, res) {

    // get the email, password, name from user
    const {email, password, fullName} = req.body

    try {
        // validations
        if(!email || !password || !fullName){
            return res.status(400).json({message: "All fields are required"})
        }

        if (password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }

        // check for email format with a regular expression
        // ex: invalid for johndoe@gmail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }

        // check if the email already existed
        const existingUser = await User.findOne({email})

        // if user already exist
        if (existingUser){
            return res.status(400).json({message: "Email already exists, please use another email"})
        }

        // assign random profile pic to user
        // generate a random num from 1 to 100
        const idx = Math.floor(Math.random() * 100) + 1

        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

        // create a new user instance // use await not new
        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar
        })
        
        // TODO: create user in stream
        // create token for authentication
        // in token, 
        // payload = userId
        const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        // add the token into the response
        res.cookie("jwt", token, {
            maxAge: 7*24*60*1000,
            httpOnly: true, //prevents XSS attacks
            sameSite: "strict", //prevents CSRF attacks
            secure: process.env.NODE_ENV === "production"
        })

        // send the response back to the user
        res.status(201).json({success: true, user:newUser})


        
    } catch (error) {
        console.log("Error in signup controller", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export async function login(req, res) {
    res.send("Login Route")
}

export function logout(req, res) {
    res.send("Logout Route")
}

