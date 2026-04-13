import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import axios from 'axios'
import { serverUrl } from '../App'

const ForgotPassword = () => {
    const [step, setStep] = useState(1)
    const [inputClicked, setInputClicked] = useState({
        email:false,
        otp: false,
        newPassword:false,
        confirmNewPassword: false
    })


    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassowrd, setConfirmNewPassowrd] = useState("")
    const [loading, setLoading] = useState(false)
    const [otp, setOtp] = useState("")
    const [err, setErr] = useState("")

    const HandleStep1=async ()=>{
      setLoading(true)
      setErr("")
      try{
        const result=await axios.post(`${serverUrl}/api/auth/sendOtp`, {email},{withCredentials: true})
        console.log(result.data)
        setStep(2)
        setLoading(false)
      }
      catch(error){
        console.log(error)
        setLoading(false)
        setErr(error.response.data.message)

      }
    }

    const HandleStep2=async ()=>{
      setLoading(true)
      setErr("")
      try{
        const result=await axios.post(`${serverUrl}/api/auth/verifyOtp`, {email,otp},{withCredentials: true})
        console.log(result.data)
        setLoading(false)
        setStep(3)
      }
      catch(error){
        console.log(error)
        setLoading(false)
        setErr(error.response.data.message)

      }
    }

    const HandleStep3=async ()=>{
      if(newPassword!==confirmNewPassowrd){
          return setErr("Passwords do not match")

        }
     
      setErr("")
      setLoading(true)
      try{
        
        const result=await axios.post(`${serverUrl}/api/auth/resetPassword`, {email,password:newPassword},{withCredentials: true})
        console.log(result.data)
        setLoading(false)
      }
      catch(error){
        console.log(error)
        setLoading(false)
        setErr(error.response.data.message)

      }
    }
  return (
    <div className='w-full h-screen bg-linear-to-b from-black to-gray-900 flex flex-col justify-center items-center'>

        {step==1 && <div className='w-[90%] max-w-125 h-125 bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]'>

        <h2 className='text-7.5 font-semibold'>Forgot Password</h2>

        <div className='relative flex items-center mt-7.5 justify-start w-[90%]  h-12.5 rounded-2xl  border-2 border-black'
        onClick={()=>setInputClicked({...inputClicked,email: true})}>
          <label htmlFor="email" className={`text-gray-700 absolute
        left-5  p-1.25 bg-white text-3.75 ${inputClicked.email?"-top-3.75":""}`}>Enter Email</label>
        <input
  type="email"
  id="email"
  className="w-full h-full rounded-2xl px-5 outline-none border-0"
  required
  onChange={(e)=>setEmail(e.target.value)}
  value={email}
/>
</div>

{err && <p className='text-red-500'>{err}</p>}

 <button className='w-[70%] px-5 py-2.5 bg-black text-white
      font-semibold h-12.5 cursor-pointer rounded-2xl mt-7.5' disabled={loading} onClick={HandleStep1}>{loading?<ClipLoader size={30} color='white'/>:"Send OTP"}
      </button>

</div>}
       
       {step==2 && <div className='w-[90%] max-w-125 h-125 bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]'>

        <h2 className='text-7.5 font-semibold'>Forgot Password</h2>

        <div className='relative flex items-center mt-7.5 justify-start w-[90%]  h-12.5 rounded-2xl  border-2 border-black'
        onClick={()=>setInputClicked({...inputClicked,otp: true})}>
          <label htmlFor="otp" className={`text-gray-700 absolute
        left-5  p-1.25 bg-white text-3.75 ${inputClicked.email?"-top-3.75":""}`}>Enter OTP</label>
        <input
  type="text"
  id="otp"
  className="w-full h-full rounded-2xl px-5 outline-none border-0"
  required
  onChange={(e)=>setOtp(e.target.value)} value={otp}
/>
</div>

{err && <p className='text-red-500'>{err}</p>}

 <button className='w-[70%] px-5 py-2.5 bg-black text-white
      font-semibold h-12.5 cursor-pointer rounded-2xl mt-7.5' disabled={loading} onClick={HandleStep2}>{loading?<ClipLoader size={30} color='white'/>:"Submit OTP"}
      </button>

</div>}

       {step==3 && <div className='w-[90%] max-w-125 h-125 bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]'>

        <h2 className='text-7.5 font-semibold'>Reset Password</h2>

        <div className='relative flex items-center mt-7.5 justify-start w-[90%]  h-12.5 rounded-2xl  border-2 border-black'
        onClick={()=>setInputClicked({...inputClicked,newPassword: true})}>
          <label htmlFor="newPassword" className={`text-gray-700 absolute
        left-5  p-1.25 bg-white text-3.75 ${inputClicked.newPassword?"-top-3.75":""}`}>Enter New Password</label>
        <input
  type="text"
  id="newPassword"
  className="w-full h-full rounded-2xl px-5 outline-none border-0"
  required
  onChange={(e)=>setNewPassword(e.target.value)} value={newPassword}
/>
</div>

    <div className='relative flex items-center mt-7.5 justify-start w-[90%]  h-12.5 rounded-2xl  border-2 border-black'
        onClick={()=>setInputClicked({...inputClicked,confirmNewPassword: true})}>
          <label htmlFor="confirmNewPassword" className={`text-gray-700 absolute
        left-5  p-1.25 bg-white text-3.75 ${inputClicked.confirmNewPassword?"-top-3.75":""}`}>Confirm New Password</label>
        <input
  type="text"
  id="confirmNewPassword"
  className="w-full h-full rounded-2xl px-5 outline-none border-0"
  required
  onChange={(e)=>setConfirmNewPassowrd(e.target.value)} value={confirmNewPassowrd}
/>
</div>

{err && <p className='text-red-500'>{err}</p>}

 <button className='w-[70%] px-5 py-2.5 bg-black text-white
      font-semibold h-12.5 cursor-pointer rounded-2xl mt-7.5' disabled={loading} onClick={HandleStep3} >{loading?<ClipLoader size={30} color='white'/>:"Reset Password"}
      </button>

</div> }





    </div>
  )
}

export default ForgotPassword