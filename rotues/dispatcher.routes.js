// Import routers. 
import messageRouter from "./messages.routes.js";

const dispatcher = (server) => {
    server.use(`/bot/message`, messageRouter); 
}

export default dispatcher; 