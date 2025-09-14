import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    bio:{
        type: String,
        default:"",        
    },
    profilePic:{
        type: String,
        default:"",        
    },
    nativeLanguage:{
        type: String,
        default:"",        
    },
    learningLanguage:{
        type: String,
        default:"",        
    },
    isOnboarded:{
        type: Boolean,
        default:false,        
    },

    friends: [
        {
            type: mongoose.Schema.Types.ObjectId, //use default ObjectId to differentiate
            ref: "User",
        }
    ]
}, {timestamps:true}); // createdAt, updateAt

const User = mongoose.model("User", userSchema)

// TODO: add explaination here
// pre hook: hash the user password before save it to the db
userSchema.pre("save", async function(next){

    // if the password is not modified, don't try to hash it
    if (!this.isModified("password")) return next()

    // hash the password
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)

        next()        
    } catch (error) {
        next(error)        
    }
})

export default User