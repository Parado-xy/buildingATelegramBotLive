// Import TelegramBOTUser model;
import TelegramBOTUser from "./models/user.model.js";
import axios from "axios";
import { BASE_BOT_URL, BOT_TOKEN } from "./env.js";
import { fetchAutoCaptionsRaw } from "./utils/botApi.utils.js";

// Here in lies the automatic replies of our bot.

const commandMessage = `
*Bot Command List*

/start  
Start the bot and receive a welcome message.

/help  
Show this list of available commands.

/summary <YouTube URL>  
Get an AI-generated summary of a YouTube video.  
Works best on videos with captions.

/transcript <YouTube URL>  
Retrieve the full transcript of a YouTube video (if available).

/watch <@channel_username>  
Start watching a YouTube channel by username (e.g. /watch @veritasium).  
You’ll get a Telegram notification whenever that channel uploads a new video.

/unwatch <@channel_username>  
Stop receiving upload notifications from a watched channel.

/watching  
View a list of all channels you’re currently watching.

/latest  
See your 3 most recent video summaries.

/feedback  
Send feedback or report a bug to the dev.

/settings  
Adjust your notification and summary preferences.

`;

const commands = [
  "/start",
  "/help",
  "/summary <YouTube URL>",
  "/transcript <YouTube URL>",
  "/watch <@channel_username>",
  "/unwatch <@channel_username>",
  "/watching",
  "/latest",
  "/feedback",
  "/settings",
];

/**
 *
 * @param {*} message
 * @param {*} command
 * @param {*} res
 * @param {*} next
 */
async function handleCommand(message, command, res, next) {
  switch (command) {
    // the /start command.
    case "/start":
      // Call the send message function on the "start" command.
      await sendMessage(message, "Markdown", res, next);
      break;
    // the /help command
    case "/help":
      // Send the help message with command list
      await sendHelpMessage(message, res, next);
      break;
    // the /summary command
    case "/summary":
      // Call the handle summary function;
      await handleSummary(message, "Markdown", res, next);
      break;
    case "/transcript":
      // TODO: Transcript function.
      await sendNotImplementedMessage(
        message,
        "Transcript feature coming soon!",
        res,
        next
      );
      break;
    case "/watch":
      // TODO: Watch function.
      await sendNotImplementedMessage(
        message,
        "Watch feature coming soon!",
        res,
        next
      );
      break;
    case "/unwatch":
      // TODO: unwatch function;
      await sendNotImplementedMessage(
        message,
        "Unwatch feature coming soon!",
        res,
        next
      );
      break;
    case "/watching":
      // TODO: watching function;
      await sendNotImplementedMessage(
        message,
        "Watching list feature coming soon!",
        res,
        next
      );
      break;
    case "/latest":
      // TODO: latest function;
      await sendNotImplementedMessage(
        message,
        "Latest summaries feature coming soon!",
        res,
        next
      );
      break;
    case "/feedback":
      // TODO: feedback function;
      await sendNotImplementedMessage(
        message,
        "Feedback feature coming soon!",
        res,
        next
      );
      break;
    case "/settings":
      // TODO: settings function;
      await sendNotImplementedMessage(
        message,
        "Settings feature coming soon!",
        res,
        next
      );
      break;
    default:
      await sendNotImplementedMessage(
        message,
        "Unknown command. Use /help to see available commands.",
        res,
        next
      );
      break;
  }
}

/**
 * This sends a message to the user depending on if they are new or not.
 * @param {object | null} botUser
 * @param {object} message
 * @param {string} [parse_mode="Markdown"]
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * */
async function sendMessage(message, parse_mode = "Markdown", res, next) {
  // If botUser is Null, means we have a new user.

  // Check if the user exists;
  const botUser = await TelegramBOTUser.findOne({
    username: message.from.username,
  });

  const isNewUser = !botUser;
  if (isNewUser) {
    // so we create an account for the user.
    try {
      await TelegramBOTUser.create({
        username: message.from.username,
        telegram_id: message.from.id,
      });

      await axios.post(`${BASE_BOT_URL}${BOT_TOKEN}/sendMessage`, {
        chat_id: message.chat.id,
        text: `Welcome to the service ${message.from.username}\n${commandMessage}`,
        parse_mode,
      });

      // We get here if the message was successfully posted
      console.log("Welcome message posted");
      res.end("ok");
    } catch (error) {
      console.error("Failed to send welcome message:", error);
      next(error);
    }
  } else {
    // If not a new user, send this message.
    try {
      await axios.post(`${BASE_BOT_URL}${BOT_TOKEN}/sendMessage`, {
        chat_id: message.chat.id,
        text: `Welcome back ${message.from.username}!\n${commandMessage}`,
        parse_mode,
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

async function handleSummary(message, parse_mode = "text", res, next) {
  try {
    // We want to get the url;
    const url = message.text.split(" ")[1]; // We assume index 1 holds the video url;

    if (!url) {
      await axios.post(`${BASE_BOT_URL}${BOT_TOKEN}/sendMessage`, {
        chat_id: message.chat.id,
        text: `Please provide a YouTube URL. Example: /summary https://youtube.com/watch?v=...`,
        parse_mode,
      });
      return res.end("ok");
    }

    // Send a "processing" message first
    await axios.post(`${BASE_BOT_URL}${BOT_TOKEN}/sendMessage`, {
      chat_id: message.chat.id,
      text: `Processing your request... Fetching video captions...`,
      parse_mode,
    });

    const captions = await fetchAutoCaptionsRaw(url);
    console.log(`Captions length: ${captions.length}`);

    await axios.post(`${BASE_BOT_URL}${BOT_TOKEN}/sendMessage`, {
      chat_id: message.chat.id,
      text: captions,
      parse_mode,
    });

    res.end("ok");
  } catch (error) {
    console.error("Failed to handle summary:", error);

    // Send error message to user
    try {
      await axios.post(`${BASE_BOT_URL}${BOT_TOKEN}/sendMessage`, {
        chat_id: message.chat.id,
        text: `Sorry, I couldn't fetch the captions for this video. Please make sure:\n\n• The URL is a valid YouTube link\n• The video has captions available\n• The video is publicly accessible`,
        parse_mode,
      });
      res.end(); // Add this to prevent webhook retries
    } catch (sendError) {
      console.error("Failed to send error message:", sendError);
      res.end(); // Add this to prevent webhook retries
    }

    next(error);
  }
}

// Helper function for /help command
async function sendHelpMessage(message, res, next) {
  try {
    await axios.post(`${BASE_BOT_URL}${BOT_TOKEN}/sendMessage`, {
      chat_id: message.chat.id,
      text: commandMessage,
      parse_mode: "Markdown",
    });
    res.end("ok");
  } catch (error) {
    console.error("Failed to send help message:", error);
    next(error);
  }
}

// Helper function for not implemented features
async function sendNotImplementedMessage(message, text, res, next) {
  try {
    await axios.post(`${BASE_BOT_URL}${BOT_TOKEN}/sendMessage`, {
      chat_id: message.chat.id,
      text: text,
      parse_mode: "Markdown",
    });
    res.end("ok");
  } catch (error) {
    console.error("Failed to send not implemented message:", error);
    next(error);
  }
}

export { commandMessage, commands, handleCommand, handleSummary };
