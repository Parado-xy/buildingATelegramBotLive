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
    "/settings"
  ];

export {commandMessage, commands}; 