
const path=require("path")
const http=require("http")
const express=require("express")
const socketio=require("./node_modules/socket.io")
const formatMessage=require("./utils/messages.js")
const {userJoin,getCurrentUser,userLeave, getRoomUsers}=require("./utils/users.js")

const { format } = require("path")

const app=express();
const server=http.createServer(app);
const io=socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname,'public/_html_css')))


//Run when client connects
io.on('connection',socket=>{

    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);
        socket.join(user.room)
        //Welcome current user
    socket.emit('message',formatMessage('Chatcord Bot',"Welcome to chatcord"))

    //Broadcast when user connects

    socket.broadcast.to(user.room).emit('message',formatMessage('Chatcord Bot',`${user.username} has joined the chat`));

    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    });

    })

    
   

    socket.on('chatMessage',(msg)=>{
        user=getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })

     //Runs when client disconnects
     socket.on('disconnect',()=>{
         const user=userLeave(socket.id)

        if(user){
            io.to(user.room).emit('message',formatMessage('Chatcord Bot',`${user.username} has left the chat`));

            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            });
        }

        
    });

})

const PORT=process.env.PORT || 3000;

server.listen(PORT,()=>{console.log("Server running on",PORT)})