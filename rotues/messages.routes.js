// Import the router object from express. 
import { Router } from "express";

// Instantiate router object; 
const messageRouter = new Router(); 

// Export router object; 
export default messageRouter; 


import { handleCommand } from "../autoreplies.js";


// attach a message route. 
messageRouter.post(`/new-message`, async (req, res, next) => {
    try{
        const { message } = req.body;

        //Each message contains "text" and a "chat" object, which has an "id" which is the chat id
        if (!message || !message.from || !message.from.username) {
          return res.end(); 
        }

        // Check if the message is the start command, if it's not, return. 
        console.log(message.text.split(" "), message.from.username);
        // TODO: LOGIC INCORRECT
        // if(!isCommand(commands, message.text.split(" ")[0])){
        //   return res.end();  
        // }

        await handleCommand(message, message.text.split(" ")[0], res, next) 

    }catch(error){
        next(error); 
    }
})


/**
 * 
 * @param {String[]} commandMessage 
 * @param {String} userInput 
 */
function isCommand(commandMessage, userInput){
  return commandMessage.includes(userInput.toLowerCase().trim())
}