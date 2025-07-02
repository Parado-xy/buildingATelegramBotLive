// Crash course into using Node.JS

// npm -> Node.js package manager. 

import express from "express";
import procees from "node:process";
import dispatcher from "./rotues/dispatcher.routes.js";

// Instatiate oru server. 
const server = express(); 

// add a json middleware. 
server.use(express.json()); // application/json request body parsing. 

// url-encoded body parsin. 
server.use(express.urlencoded({extended: true}));

// use the dispatcher for routes management. 
dispatcher(server); 

const port = procees.env.PORT || 3000; 

// Make the server listen on a port. 
server.listen(port, ()=> {
    console.log(`BOT Server live on port :{3000} `); 
})