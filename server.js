
const path=require("path")
const http=require("http")
const express=require("express")
const socketio=require("./node_modules/socket.io")
const formatMessage=require("./utils/messages.js")
const { format } = require("path")

const app=express();
const server=http.createServer(app);
const io=socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname,'public/_html_css')))


//Run when client connects
io.on('connection',socket=>{

    socket.on('joinRoom',({username,room})=>{
        //Welcome current user
    socket.emit('message',formatMessage('Chatcord Bot',"Welcome to chatcord"))

    //Broadcast when user connects

    socket.broadcast.emit('message',formatMessage('Chatcord Bot','A user has joined the chat'));


    })

    
   

    socket.on('chatMessage',(msg)=>{
        io.emit('message',formatMessage('USER',msg))
    })

     //Runs when client disconnects
     socket.on('disconnect',()=>{
        io.emit('message',formatMessage('Chatcord Bot','A user has left the chat'));
    });

})

const PORT=process.env.PORT || 3000;

server.listen(PORT,()=>{console.log("Server running on",PORT)})