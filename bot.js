// Crash course into using Node.JS

// npm -> Node.js package manager. 

import express from "express";
import procees from "node:process";
import dispatcher from "./rotues/dispatcher.routes.js";
import errorMiddleware from "./middlewares/error.middlewares.js";
import connectDB from "./db/mongodb.db.js";

// Instatiate oru server. 
const server = express(); 

// add a json middleware. 
server.use(express.json()); // application/json request body parsing. 

// url-encoded body parsin. 
server.use(express.urlencoded({extended: true}));

// use the dispatcher for routes management. 
dispatcher(server); 

server.use(errorMiddleware); 
// next(error); 

const port = 8443; 

// Make the server listen on a port. 
server.listen(port, ()=> {
    console.log(`BOT Server live on port :${port} `); 

    connectDB(); 
})