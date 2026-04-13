import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js"
import User from "../models/user.model.js";
import { getIO, getSocketId} from "../socket.js";
import Notification from "../models/notification.model.js";
import { populate } from "dotenv";
const io=getIO();



export const uploadPost = async (req, res) => {
    try {
        const { caption, mediaType } = req.body
        let media;
        if (req.file) {
            media = await uploadOnCloudinary(req.file.path)
        }
        else {
            return res.status(400).json({
                message: "Media is Required"
            })
        }
        const post = await Post.create({
            caption, media, mediaType, author: req.userId
        })
        const user = await User.findById(req.userId)
        user.posts.push(post._id)
        await user.save()
        const populatedPost = await Post.findById(post._id).populate("author", "name userName profileImage")
        return res.status(201).json(populatedPost)

    }
    catch (error) {
        return res.status(500).json({
            message: `UploadPost error ${error}`
        })
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate("author", "name userName profileImage").populate("comments.author","name userName profileImage").sort({createdAt:-1})

        return res.status(200).json(posts)

    }
    catch (error) {
        return res.status(500).json({
            message: `getAllPosts error ${error}`
        })
    }
}

export const like = async (req, res) => {
    try {
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({
                message: "Post Not Found"
            })
        }

        const alreadyLiked = post.likes.some(id => id.toString() == req.userId.toString())

        if (alreadyLiked) {  //->Phle hi like kre aur fir kie krenge to hat jaayefa
            post.likes = post.likes.filter(id => id.toString() != req.userId.toString())
        }
        else {  //->>Phli baar likre kr rhe h
            post.likes.push(req.userId)
            if(post.author._id!=req.userId){
                const notification=await Notification.create({
                    sender:req.userId,
                    reciever:post.author._id,
                    type:"like",
                    post:post._id,
                    message:"Liked Your Post"
                })
                const populatedNotification=await Notification.findById(notification._id).
                populate("sender reciever post")
                const recieverSocketId=getSocketId(post.author._id)
                if(recieverSocketId){
                    io.to(recieverSocketId).emit("newNotification",populatedNotification)
                }
            }
        }


        await post.save()
        await post.populate("author", "name userName profileImage")
        io.emit("likedPost",{
            postId:post._id,
            likes:post.likes
        })
        return res.status(200).json(post)

    } catch (error) {
        return res.status(500).json({
            message: `LikePosts error ${error}`
        })


    }
}

export const comment = async (req, res) => {
    try {
        const { message } = req.body
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({
                message: "Posts Not Found"
            })
        }
        post.comments.push({
            author: req.userId,
            message
        })
           if(post.author._id!=req.userId){
                const notification=await Notification.create({
                    sender:req.userId,
                    reciever:post.author._id,
                    type:"comment",
                    post:post._id,
                    message:"Commented On Your Post"
                })
                const populatedNotification=await Notification.findById(notification._id).
                populate("sender reciever post")
                const recieverSocketId=getSocketId(post.author._id)
                if(recieverSocketId){
                    io.to(recieverSocketId).emit("newNotification",populatedNotification)
                }
            }
        await post.save()
        await post.populate("author", "name userName profileImage")
        await post.populate("comments.author")
        io.emit("commentedPost",{
            postId:post._id,
            comments:post.comments
        })
        return res.status(200).json(post)
    }
    catch (error) {
        return res.status(500).json({
            message: `CommenetPosts error ${error}`
        })
    }
}

export const saved = async (req, res) => {
    try {
        const postId = req.params.postId
        const post = await Post.findById(postId)
        const user = await User.findById(req.userId)
        if (!post) {
            return res.status(400).json({
                message: "Post Not Found"
            })
        }

        const alreadySaved = user.saved.some(id => id.toString() == postId.toString())

        if (alreadySaved) {  //->Phle hi saved kre aur fir kie krenge to hat jaayefa
            user.saved = user.saved.filter(id => id.toString() != postId.toString())
        }
        else {  //->>Phli baar likre kr rhe h
            user.saved.push(postId)
        }
        await user.save()
        user.populate("saved")
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({
            message: `Saved Posts error ${error}`
        })


    }
}

