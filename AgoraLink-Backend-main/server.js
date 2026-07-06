const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const groupRouter = require("./routes/groupRoutes");
const messageRouter = require("./routes/messageRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const socketIo = require("./socket");


// config
dotenv.config();


// app create
const app = express();


// create http server
const server = http.createServer(app);



// Socket.io setup

const io = socketio(server, {

  cors: {

    origin: "*",

    methods: ["GET","POST","PUT","DELETE"],

    credentials: true

  }

});




// Middlewares

app.use(
  cors({

    origin:"*",

    credentials:true

  })
);


app.use(express.json());

// access uploaded files
app.use(
  "/uploads",
  express.static("uploads")
);




// Database Connection

mongoose
.connect(process.env.MONGO_URL)

.then(()=>{

console.log("Connected to Database");

})

.catch((error)=>{

console.log(
"MongoDB connection failed",
error
);

});




// Initialize socket

socketIo(io);




// Test Route

app.get("/",(req,res)=>{

res.send(
"AgoraLink Backend Running"
);

});




// API Routes

app.use(
"/api/users",
userRouter
);


app.use(
"/api/groups",
groupRouter
);


app.use(
"/api/messages",
messageRouter
);


app.use(
"/api/workspace",
workspaceRoutes
);




// Start server

const PORT =
process.env.PORT || 5000;


server.listen(
PORT,
()=>{

console.log(
`Server is running on PORT ${PORT}`
);

});