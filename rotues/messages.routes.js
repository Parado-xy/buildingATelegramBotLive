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

import { BOT_TOKEN, BASE_BOT_URL } from "../env.js";
import { commandMessage, commands } from "../autoreplies.js";


// attach a message route. 
messageRouter.post(`/new-message`, async (req, res, next) => {
    try{
        const { message } = req.body;

        //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
        if (!message || !message.from || !message.from.username) {
          return res.end();
        }

        // Check if the message is the start command, if it's not, return. 
        console.log( message.text.split(" "))
        if(!isCommand(commands, message.text.split(" ")[0])){
          return res.end();  
        }


        // Check if the user exists; 
        const botUser = await TelegramBOTUser.findOne({
          username: message.from.username
        }); 

        // Send the welcome message. 
        await sendMessage(botUser, message, "Markdown", res, next);


    }catch(error){
        next(error); 
    }
})


/**
 * This sends a message to the user depending on if they are new or not. 
 * @param {object | null} botUser
 * @param {object} message
 * @param {string} [parse_mode="text"] 
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * */ 
async function sendMessage(botUser, message, parse_mode="text", res, next){
  // If botUser is Null, means we have a new user. 
  const isNewUser = !botUser;
  if(isNewUser){
    // so we create an account for the user. 
    try {
      await TelegramBOTUser.create(
        {
          username: message.from.username,
          telegram_id: message.from.id
        }
      )
  
      await axios.post(`${BASE_BOT_URL}${BOT_TOKEN}/sendMessage`, {
          chat_id: message.chat.id,
          text: `Welcome to the service ${message.from.username}\n${commandMessage}`,
          parse_mode
        });
      
      // We get here if the message was successfully posted
      console.log("Welcome message posted");
      res.end("ok");

    } catch (error) {
      console.error("Failed to send welcome message:", error);
      next(error);
    }
  }else{
    // If not a new user, send this message. 
    try {
      await axios.post(`${BASE_BOT_URL}${BOT_TOKEN}/sendMessage`, {
        chat_id: message.chat.id,
        text: `Welcome back ${message.from.username}!\n${commandMessage}`,
        parse_mode
      });
      
      // We get here if the message was successfully posted
      console.log("Welcome back message posted");
      res.end("ok");

    } catch (error) {
      console.error("Failed to send welcome back message:", error);
      next(error);
    }
  }
}

/**
 * 
 * @param {String[]} commandMessage 
 * @param {String} userInput 
 */
function isCommand(commandMessage, userInput){
  return commandMessage.includes(userInput.toLowerCase().trim())
}