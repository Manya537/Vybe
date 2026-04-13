
import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/messages.model.js"

import { getSocketId,getIO, io } from "../socket.js";


export const sendMessage=async(req,res)=>{
    try{
        const senderId=req.userId
        const recieverId=req.params.recieverId
        const {message}=req.body

        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
        }

        const newMessage=await Message.create({
            sender:senderId,
            reciever:recieverId,
            message,
            image
        })

        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,recieverId]}
        })
        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId,recieverId],
                messages:[newMessage._id]
            })
        }
        else{
            conversation.messages.push(newMessage._id)
            await conversation.save()
        }
//->>  Reciever Id se socketId le lete h map ko access krke

        const io=getIO();

        const recieverSocketId=getSocketId(recieverId)
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",newMessage)
        }
        

        return res.status(200).json(newMessage)


    }
    catch(error){
        return res.status(500).json({
            message:`Send Message Erro ${error}`
        })

    }
}

export const getAllMessages=async(req,res)=>{
    try{
        const senderId=req.userId
        const recieverId=req.params.recieverId
        const conversation=await Conversation.findOne(
            {
             participants:{$all:[senderId,recieverId]}
        }).populate("messages")

        return res.status(200).json(conversation?.messages)
    }
    catch(error){
        return res.status(500).json({
            message:`Get message error ${error}`
        })
    }
}

export const getPrevUserChats=async(req,res)=>{
    try{
        const currentUserId=req.userId
        const conversations=await Conversation.find({
            participants:currentUserId
        }).populate("participants").sort({updatedAt:-1})

        const userMap={}   //562983u9:user

        conversations.forEach(conv=>{
            conv.participants.forEach(user=>{
                if (user._id.toString() !== currentUserId.toString())
{
                  userMap[user._id] = user;


                }
            })
        })

        const previousUsers=Object.values(userMap)
        return res.status(200).json(previousUsers)

    }
    catch(error){
         return res.status(500).json({
            message:`Get Previous Users error ${error}`
        })
    }
}