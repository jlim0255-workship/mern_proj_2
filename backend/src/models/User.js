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

// TODO: add explaination here
// pre hook: hash the user password before save it to the db
// before save the user to the database, hash the password
userSchema.pre("save", async function(next){

    // if the password is not modified, don't try to hash it

    // IMPORTANT
    // if user is trying to update something else than password
    // return next() and don't try to update the password
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

const User = mongoose.model("User", userSchema)



export default User