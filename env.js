import {config} from "dotenv"; 

// Configure environment variables.
config(); // The config function doesn't have to be passed anything if your env file is in the root of your folder. 

// Export env variables. 
export const  {
    BASE_BOT_URL, BOT_TOKEN, MONGODB_URI, YT_API_KEY
} = process.env;

