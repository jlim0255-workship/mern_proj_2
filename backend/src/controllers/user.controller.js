import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

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

        res.status(200).json(recommendedUsers)
        
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error)
        res.status(500).json({success: false, message: "Internal Server Error"})        
    }

}

export async function getMyFriends(req, res){
    try {
        const user = await User.findById(req.user.id).select("friends").populate("friends", "fullName profilePic, nativeLanguage learningLanguage")

        res.status(200).json(user.friends)
        
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message)
        res.status(500).json({message: "Internal Server Error"})
        
    }
    
}

export async function sendFriendRequest(req, res) {
    try {
        // req is coming from protectRoute middleware
        // we have the user info in req.user
        const myId = req.user.id;

        // recipient id is from the url /friend-request/:id
        // {id: recipientId} is object destructuring
        // we are renaming id to recipientId
        const {id: recipientId} = req.params;

        // prevent sending request to yourself
        if (myId === recipientId) {
            return res.status(400).json({message: "You cannot send friend request to yourself"})
        }

        // check if the recipient user exists
        const recipient = await User.findById(recipientId);
        if (!recipient){
            return res.status(404).json({message: "Recipient user not found"})

        }

        // check if the recipient is already user's friend
        if (recipient.friends.includes(myId)){
            return res.status(400).json({message: "You are already friends with this user"})
        }

        // check if the request already exist        
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient: recipientId},
                {sender: recipientId, recipient: myId}
            ]

        })

        if (existingRequest){
            return res.status(400).json({message: "A friend request already exists between you and this user"})
        }

        // else, create a new friend request
        const friendRequest = new FriendRequest({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);


        
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message)
        res.status(500).json({message: "Internal Server Error"})
        
    }
}