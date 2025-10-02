import User from "../models/User.js";

export async function getRecommendedUsers(req, res){
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        // Find users who are not the current user and not already friends
        const recommendedUsers = await User.find({
            $and: [
                {_id: { $ne: currentUserId } }, // Exclude current user
                {$id: { $in: currentUser.friends } }, // Exclude current user's friends
                {isOnboarded: true} // Only include onboarded users
                ]
        })

        res.status(200).json({success: true, users: recommendedUsers})
        
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error)
        res.status(500).json({success: false, message: "Internal Server Error"})        
    }

}

export async function getMyFriends(req, res){
    
}