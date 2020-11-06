
const path=require("path")
const http=require("http")
const express=require("express")
const socketio=require("../Sockets/node_modules/socket.io")

const app=express();
const server=http.createServer(app);
const io=socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname,'public/_html_css')))


//Run when client connects
io.on('connection',socket=>{
    console.log("New web socket connection")
    socket.emit('message',"Welcome to chatcord")

})

const PORT=process.env.PORT || 3000;

server.listen(PORT,()=>{console.log("Server running on",PORT)})