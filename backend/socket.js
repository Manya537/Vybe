//server create krne wale h server ko modify krenge
//  //Bidrection communication kre w/o request
import http from "http"
import express from "express"
import { Server } from "socket.io"

const app=express()
const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        method:["GET","POST"]
    }
})

const userSocketMap={}  //userId:socketId

export const getSocketId=(recieverId)=>{
    return userSocketMap[recieverId]
};

export const getIO = () => {
  return io;
};

io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId   
    //Frontend ke saath haath mila rhe h  with this query
    if(userId!=undefined){
        userSocketMap[userId]=socket.id
    }

    //saare online user ko connect krenge
io.emit('getOnlineUsers',Object.keys(userSocketMap))



    socket.on('disconnect',()=>{
        delete userSocketMap[userId]
        io.emit('getOnlineUsers',Object.keys(userSocketMap))

    })
})



export {app,io,server}  //io->>Bidirectional server
//server->>Single directional server
