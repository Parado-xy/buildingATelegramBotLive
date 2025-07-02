// Import the router object from express. 
import { Router } from "express";

// Import axios for sending request. 
import axios from "axios";

// Instantiate router object; 
const messageRouter = new Router(); 

// Export router object; 
export default messageRouter; 

// Import the user schema. 
import TelegramBOTUser from "../models/user.model.js";

// TOP LEVELL CONSTANTS
const BOT_TOKEN =
  process.env.BOT_TOKEN || "7828660251:AAGAUoji46BxC4pg3yJeb2AAc2HRLmGlYUM";


// attach a message route. 
messageRouter.post(`/new-message`, async (req, res, next) => {
    try{
        const { message } = req.body;

        // Let's actually log the request body
        console.log(req.body); 


        //Each message contains "text" and a "chat" object, which has an "id" which is the chat id

        if (!message) {
          return res.end();
        }

        // To see the structure of the message. 
        console.log(`message: ${message}`);  

        // Check if the user exists; 
        const BOT_USER = TelegramBOTUser.findOne({
          username: message.from.username
        }); 

        await sendMessage(BOT_USER, message)



    }catch(error){
        // next(error); 
    }
})


/**
 * This sends a message to the user depending on if they are new or not. 
 * @param {bool} */ 
async function sendMessage(isNewUser, message){
  if(isNewUser){

    await TelegramBOTUser.create(
      {
        username: message.from.username,
        telegram_id: message.from.id
      }
    )

    axios
      .post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: message.chat.id,
        text: `Welcome to the service ${message.from.username}`,
      })
      .then((response) => {
        // We get here if the message was successfully posted
        console.log("Message posted");
        res.end("ok");
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        // next(error);
      });
  }else{
    // If not a new user, send this message. 
    axios
      .post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: message.chat.id,
        text: `Welcome back ${message.from.username}!`,
      })
      .then((response) => {
        // We get here if the message was successfully posted
        console.log("Message posted");
        res.end("ok");
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        // next(error);
      });
  }
}