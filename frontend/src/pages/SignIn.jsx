import React, { useState } from 'react'
import logo from "../assets/Vybe.jpg"
import logo1 from "../assets/logo1.jpg"
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import axios from 'axios';
import { serverUrl } from "../App";
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';


const SignIn = () => {

  const [inputClicked, setInputClicked] = useState(
    {
      userName:false,
      password:false
    }
  )

  const [showPassword, setShowPassword] = useState(false)
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate=useNavigate()
  const dispatch=useDispatch()

  const handleSigIn=async()=>{
    setLoading(true);
    setErr("");
    try{
      const result=await axios.post(`${serverUrl}/api/auth/signin`,
        {userName,password},{withCredentials: true})

        dispatch(setUserData(result.data))
     
      setLoading(false);
    }
    catch(error){
      console.log(error);
      setLoading(false);
      setErr(error.response?.data?.message)
    }
  }





  return (
    <div className='w-full h-screen bg-linear-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
      <div className='w-[90%] lg:max-w-[60%] h-150 bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]'>

      <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-2.5 gap-5'>

        <div className='flex gap-2.5 items-center  text-5 font-semibold mt-10'>
          <span>Sign In To</span>
          <img src={logo} alt="" className='w-15.5 '/>
        </div>

 
        
        <div className='relative flex items-center justify-start w-[90%]  h-12.5 rounded-2xl  border-2 border-black'
        onClick={()=>setInputClicked({...inputClicked,userName: true})}>
          <label htmlFor="userName" className={`text-gray-700 absolute
              left-5  p-1.25 bg-white text-3.75 ${inputClicked.userName?"-top-3.75":""}`}>Enter UserName</label>
           <input type="text" id="userName" className="w-full h-full rounded-2xl px-5 outline-none border-0" required onChange={(e)=>setUserName(e.target.value)} value={userName}
          /></div>

          


        <div className='relative flex items-center justify-start w-[90%]  h-12.5 rounded-2xl  border-2 border-black'
        onClick={()=>setInputClicked({...inputClicked,password: true})}>
          <label htmlFor="password" className={`text-gray-700 absolute
              left-5  p-1.25 bg-white text-3.75 ${inputClicked.password?"-top-3.75":""}`}>Enter Password</label>
           <input type={showPassword?"text":"password"} id="password" className="w-full h-full rounded-2xl px-5 outline-none border-0" required
           onChange={(e)=>{
            setPassword(e.target.value);
           }}/>
           {!showPassword?<IoIosEye className='absolute cursor-pointer right-5 w-6.25 h-6.25' onClick={()=>setShowPassword(true)}/>:<IoIosEyeOff className='absolute cursor-pointer right-5 w-6.25 h-6.25' onClick={()=>setShowPassword(false)}/>}
           
</div>
     <div className="w-[90%] px-5 cursor-pointer" onClick={()=>navigate("/forgot-password")}>Forgot Password</div>

     {err && <p className='text-red-500'>{err}</p>}



      <button className='w-[70%] px-5 py-2.5 bg-black text-white
      font-semibold h-12.5 cursor-pointer rounded-2xl mt-7.5' onClick={handleSigIn} disabled={loading}>{loading?<ClipLoader size={30} color='white'/>:"Sign In"}
      </button>
      <p className='cursor-pointer text-gray-800' onClick={()=>navigate("/signup")}>Want To Create a New Account ?<span className='border-b-2 border-b-black pb-0.75 text-black'>Sign Up</span></p>


      </div>
      <div className='md:w-[50%] h-full hidden lg:flex
      justify-center items-center bg-[#000000] flex-col gap-2.5 text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black'>


        <img src={logo1} alt="" className='w-[40%]'/>
        <p>Not Just A Platform,It's A VYBE</p>

 


      </div>


      </div>
    </div>
  )
}

export default SignIn
 