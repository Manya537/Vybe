import sendMail from "../config/Mail.js";
import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
export const signUp=async(req,res)=> {
    try {
        const {name,email,password,userName}=req.body;
          

        const findByEmail=await User.findOne({email});
        if(findByEmail){
            return res.status(400).json({
                message:"Email Already Exists!"
            })
        }

        const findByUserName=await User.findOne({userName});
        if(findByUserName){
            return res.status(400).json({
                message:"UserName Already Exists!"
            })
        }

        if(password.length<6){
            return res.status(400).json({
                message:"Password must be atleast 6 Characters !"
            })
        }

        const hashedPaswowrd=await bcrypt.hash(password,10)

        const user=await User.create({
            name,
            userName,
            email,
            password:hashedPaswowrd

        })

        const token=await genToken(user._id);
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*365*24*60*60*1000,
            secure:"false",
            sameSite:"Strict"
        })

        return res.status(201).json(user)


        
    } catch(error){
        return res.status(500).json({
            message:`SignUp Error ${error}`
        })


    }
}

export const signIn=async(req,res)=> {
    try {
        const {password,userName}=req.body

        const user=await User.findOne({userName});
        if(!user){
            return res.status(400).json({
                message:"User Not Found!"
            })
        }

        const isMatch=await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({
                message:"Incorrect Password !"
            })
        }
        const token=await genToken(user._id);

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*365*24*60*60*1000,
            secure:"false",
            sameSite:"Strict"
        })

        return res.status(201).json(user)


        
    } catch(error){
        return res.status(500).json({
            message:`SignIn Error ${error}`
        })


    }
}

export const signOut=async(req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({
            message:"LogOut Successfully"
        })

    }
    catch(error){
        return res.status(500).json({
            message:`SignOut Error ${error}`
        })

    }
}

export const sendOtp=async(req,res)=>{
    try {
        const {email}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"User Not Found"
            })

        }
        const otp=Math.floor(1000+Math.random()*9000).toString()

        user.resetOtp=otp,
        user.otpExpires= Date.now()+5*60*1000
        user.isOtpVerified=false //Abhi hm step 1 me h jha pe sirf otp send kr rhe h abhi verified false hi rhega
        
        await user.save()
        await sendMail(email,otp)
        return res.status(200).json({message:"Email successfully send"})


    }
    catch(error){
        return res.status(500).json({message:`send Otp error ${error}`})

    }
}

export const verifyOtp=async(req,res)=>{
    try{
        const {email,otp}=req.body

        const user=await User.findOne({email})

        if(!user || user.resetOtp!==otp || user.otpExpires< Date.now()){
            return res.status(400).json({message:"Invalid/Expired OTP"})

        }

        user.isOtpVerified=true
        user.resetOtp=undefined
        user.otpExpires=undefined

        await user.save()

        return res.status(200).json({
            message:"OTP Verified Successfully"
        })

    }
    catch(error){
        return res.status(500).json({message:`Verify Otp error ${error}`})

    }
}

export const resetPassword=async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user || !user.isOtpVerified){
            return res.status(400).json({
                message:"OTP Verifivcation required"
            })
        }

        const hashedPasswowrd=await bcrypt.hash(password,10)

       if (password) {
            const hashedPassword = await bcrypt.hash(password, 12)
            user.password = hashedPassword
        }

        await user.save()

        return res.status(200).json({
            message:"Password Reset Successfully"
        })



    }
    catch(error){
        return res.status(500).json({
            messsage:`Reset OTP Error ${error}`
        })

    }
}



