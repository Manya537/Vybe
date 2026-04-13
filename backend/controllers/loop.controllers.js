import uploadOnCloudinary from "../config/cloudinary.js";
import Loop from "../models/loop.model.js";
import User from "../models/user.model.js";
import { getIO,getSocketId} from "../socket.js";
import Notification from "../models/notification.model.js";

const io=getIO();

export const uploadLoop=async(req,res)=>{
    try{
        const {caption}=req.body
        let media;
        if(req.file){
            media=await uploadOnCloudinary(req.file.path)
        }
        else {
            return res.status(400).json({
                message:"Media is Required"
            })
        }
        const loop=await Loop.create({
            caption,
            media,
            author:req.userId
        })
        const user=await User.findById(req.userId)
        user.loops.push(loop._id)
        await user.save()
        const populatedLoop=await Loop.findById(loop._id).populate("author","name userName profileImage")
        return res.status(201).json(populatedLoop)

    }
    catch(error){
        return res.status(500).json({
            message:`Upload Loop error ${error}`
        })
    }  
}

export const like=async(req,res)=>{
    try{
        const loopId=req.params.loopId
        const loop=await Loop.findById(loopId)
        if(!loop){
            return res.status(400).json({
                message:"Loop Not Found"
            })
        }

        const alreadyLiked=loop.likes.some(id=>id.toString() == req.userId.toString())

        if(alreadyLiked){  //->Phle hi like kre aur fir kie krenge to hat jaayefa
            loop.likes=loop.likes.filter(id=>id.toString()!=req.userId.toString())
        }
        else{  //->>Phli baar likre kr rhe h
            loop.likes.push(req.userId)
               if(loop.author._id!=req.userId){
                            const notification=await Notification.create({
                                sender:req.userId,
                                reciever:loop.author._id,
                                type:"like",
                                loop:loop._id,
                                message:"Liked Your Loop"
                            })
                            const populatedNotification=await Notification.findById(notification._id).
                            populate("sender reciever loop")
                            const recieverSocketId=getSocketId(loop.author._id)
                            if(recieverSocketId){
                                io.to(recieverSocketId).emit("newNotification",populatedNotification)
                            }
                        }
        }
        await loop.save()
        await loop.populate("author","name userName profileImage") 
        io.emit("likedLoop",{
            loopId:loop._id,
            likes:loop.likes
        })
        return res.status(200).json(loop)

    }catch(error){
         return res.status(500).json({
            message:`Like Loop error ${error}`
        })


    }
}

export const comment=async(req,res)=>{
    try{
        const {message}=req.body
        const loopId=req.params.loopId
        const loop=await Loop.findById(loopId) 
        if(!loop){
            return res.status(400).json({
                message:"Loops Not Found"
            })
        }
        loop.comments.push({
            author:req.userId,
            message
        })

        if(loop.author._id!=req.userId){
                            const notification=await Notification.create({
                                sender:req.userId,
                                reciever:loop.author._id,
                                type:"comment",
                                loop:loop._id,
                                message:"Commented On Your Loop"
                            })
                            const populatedNotification=await Notification.findById(notification._id).
                            populate("sender reciever loop")
                            const recieverSocketId=getSocketId(loop.author._id)
                            if(recieverSocketId){
                                io.to(recieverSocketId).emit("newNotification",populatedNotification)
                            }
                        }

        await loop.save()
        await loop.populate("author","name userName profileImage")
        await loop.populate("comments.author")
        io.emit("commentedLoop",{
            loopId:loop._id,
            comments:loop.comments
        })
        return res.status(200).json(loop)
    }
    catch(error){
         return res.status(500).json({
            message:`Comment Loop error ${error}`
        })
    }
}


export const getAllLoops=async(req,res)=>{
    try{
        const loops=await Loop.find({}).populate("author","name userName profileImage").populate("comments.author")

        return res.status(200).json(loops)

    }
    catch(error){
        return res.status(500).json({
            message:`getAll Loops error ${error}`
        })

    }

}