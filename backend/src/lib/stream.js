import {StreamChat} from "stream-chat"
import dotenv from "dotenv"
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("STREAM_API_KEY or STREAM_API_SECRET is missing")
    
}

// create a stream client
// to interact with the stream application
const streamClient = StreamChat.getInstance(apiKey, apiSecret)

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData])
        return userData        
    } catch (error) {
        console.log("Error upserting Stream user", error)
    }
}

// TODO
export const generateStreamToken = (userId) => {

}