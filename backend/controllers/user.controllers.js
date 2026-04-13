import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js";
import { getIO,getSocketId} from "../socket.js";
const io=getIO();
export const getCurrentUser=async(req,res)=>{
    try {

        const userId=req.userId
        const user=await User.findById(userId).populate("posts loops posts.author posts.comments story following")
        if(!user){
            return res.status(400).json({message: "User Not found"})
        }
        return res.status(200).json(user)


    }
    catch(error){
        return res.status(500).json({
            message:`Get Current User error ${error}`
        })

    }
}

export const suggestedUsers=async(req,res)=>{
    try{
        const users=await User.find({
            _id:{$ne:req.userId}
            }).select("-password")
        return res.status(200).json(users)

    }
    catch(error){
        return res.status(500).json({
            message:`Get Suggested User error ${error}`
        })

    }
}

export const editProfile=async(req,res)=>{
    try{
        const {name,userName,bio,profession,gender}=req.body
        const user=await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(400).json({
                message:"User Not found"
            })
        }
        const sameUserWithUserName=await User.findOne({userName}).select("-password")

       if (sameUserWithUserName && sameUserWithUserName._id.toString() !== req.userId) {
    return res.status(400).json({
        message: "UserName Already Exist"
    })
}


        let profileImage;
        if(req.file){
            profileImage=await uploadOnCloudinary(req.file.path)
        }

        user.name=name
        user.userName=userName
        if(profileImage){
            user.profileImage=profileImage
        }
        user.bio=bio
        user.profession=profession
        user.gender=gender

        await user.save()

        return res.status(200).json(user)


    }
    catch(error){
         return res.status(500).json({
            message:`Edit Profile error ${error}`
        })

    }

}

export const getProfile=async(req,res)=>{
    try{
        const {userName}=req.params
        const user=await User.findOne({userName}).select("-password").populate("posts loops followers following")
        if(!user){
            return res.status(400).json({
                message:"User Not Found"
            })
        }

        return res.status(200).json(user)

    }
    catch(error){

         return res.status(500).json({
            message:`Get Profile error ${error}`
        })

    }
}

export const follow=async(req,res)=>{

    try{
        const currentUserId=req.userId
        const targetUserId=req.params.targetUserId

        if(!targetUserId){
            return res.status(400).json({message:"Target user is not found"})
        }
        if(currentUserId==targetUserId){
            return res.status(400).json({message:"You can Not floow yourself."})
        }

        const currentUser=await User.findById(currentUserId)
        const targetUser=await User.findById(targetUserId)

        const isFollowing=currentUser.following.includes(targetUserId)

        if(isFollowing){
            currentUser.following= currentUser.following.filter(id=>id.toString()!=targetUserId)
            targetUser.followers=targetUser.followers.filter(id=>id.toString()!=currentUserId)

            await currentUser.save()
            await targetUser.save()
            return res.status(200).json({
                following: false,
                message: "Unfollow Succesfully"
            })
        }
        else{  //Not following before so follow him  push
            currentUser.following.push(targetUserId)
            targetUser.followers.push(currentUserId)
            if(currentUser._id!= targetUser._id){
                            const notification=await Notification.create({
                                sender:currentUser._id,
                                reciever:targetUser._id,
                                type:"follow", 
                                message:"Started Following You"        
                            })
                            const populatedNotification=await Notification.findById(notification._id).
                            populate("sender reciever")
                            const recieverSocketId=getSocketId(targetUser._id)
                            if(recieverSocketId){
                                io.to(recieverSocketId).emit("newNotification",populatedNotification)
                            }
                        }
            await currentUser.save()
            await targetUser.save()
            return res.status(200).json({
                following: true,
                message: "follow Succesfully"
            })


        }


    }
    catch(error){
        return res.status(500).json({
            message:`Follow error ${error}`
        })

    }
}

export const followingList=async(req,res)=>{
    try{
        const result=await User.findById(req.userId)
        return res.status(200).json(result?.following)

    }
    catch(error){
        return res.status(500).json({
            message:`Following List error ${error}`
        })
    }
}

export const search=async(req,res)=>{
    try{
        const keyWord=req.query.keyword

        if(!keyWord){
            return res.status(400).json({
                message:"Keyword is required"
            })
        }

        const users=await User.find({
            $or:[
                {userName:{$regex:keyWord,$options:"i"}},
                {name:{$regex:keyWord,$options:"i"}},
            ]
        }).select("-password")

        return res.status(200).json(users)

    }
    catch(error){
         return res.status(500).json({
            message:`Search error ${error}`
        })

    }
}

export const getAllNotifications=async(req,res)=>{
    try{
        const notifications=await Notification.find({
            reciever:req.userId
        }).populate("sender reciever post loop").sort({createdAt:-1})
        return res.status(200).json(notifications)

    }
    catch(error){
        return res.status(200).json({
            message:`Get Notification Error: ${error}`
        })
    }
}

export const markAsRead=async(req,res)=>{
    try{
        const {notificationId}=req.body
        if(Array.isArray(notificationId)){
            //Bulk mARKS AS rEad
            await Notification.updateMany(
                {_id: { $in:notificationId},
            reciever:req.userId},
            {$set:{isRead: true}}
            );
        }
        else{
            //Mark single notification as read
            await Notification.findOneAndUpdate(
                {_id:notificationId,reciever:req.userId},
                {$set:{isRead: true}}
            );
        }
        return res.status(200).json({message:"Marked as Read"})
    }
    catch(error){
         return res.status(200).json({
            message:`Read Notification Error Error ${error}`
        })
        
    }
}

