import mongoose, {Schema} from "mongoose"; 

// Instantiate a user Schema. 
const TelegramBOTUserSchema = new Schema(
    {
        "username": {
            type: String,
            required: true
        },
        "telegram_id": {
            type: Number,
            required: true,
            index: true
        },
        "watch_list": {
            type: [String] // Handles or IDs of YT channels. 
        }
    }
);


const TelegramBOTUser = mongoose.model("TelegramBOTUser", TelegramBOTUserSchema); 

export default TelegramBOTUser; 