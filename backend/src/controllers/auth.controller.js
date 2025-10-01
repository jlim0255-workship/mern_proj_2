import User from "../models/User.js"
import jwt from "jsonwebtoken"
import { upsertStreamUser } from "../lib/stream.js"

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

        try {
            await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || ""
        })

            console.log("Stream user created/updated")
            
        } catch (error) {
            console.log("Error creating/updating Stream user", error)
        }
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
    try {
        // get the request from user: email and password from user
        const {email, password} = req.body
        
        // validations
        if (!email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({message: "Invalid email or password"})
        }
        
        // use .matchPassword instead of comparePassword!
        const isPasswordCorrect = await user.matchPassword(password)

        if(!isPasswordCorrect){
            return res.status(401).json({message: "Invalid email or password"})
        }

        // create token for authentication
        // in token, 
        // payload = userId
        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        // add the token into the response
        res.cookie("jwt", token, {
            maxAge: 7*24*60*1000,
            httpOnly: true, //prevents XSS attacks
            sameSite: "strict", //prevents CSRF attacks
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({success: true, user})


    } catch (error) {
        console.log("Error in login controller", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export function logout(req, res) {
    // clear the cookie
    res.clearCookie("jwt")
    res.status(200).json({success: true, message: "Logged out successfully"})
}

export async function onboard(req, res) {
    try {
        // get userId from req.user
        const userId = req.user._id
        // get the other fields from req.body
        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean), // filter out the falsy values
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,            
        }, {new:true}) //{new:true} to guarantee that the updated user is returned

        if(!updatedUser){
            return res.status(404).json({message: "User not found"})
        }

        
        try {
            // TODO: Update user info in stream
            await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePic || ""
            })

            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)            
            
        } catch (error) {
            console.log("Error updating stream user", error)
        }
        

        res.status(200).json({success: true, user: updatedUser})


        
    } catch (error) {
        console.log("Error in onboard controller", error)
        res.status(500).json({message: "Internal server error"})
    }
}