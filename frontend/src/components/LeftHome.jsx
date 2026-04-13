import React from 'react'
import logo from "../assets/logo1.jpg";
import { FaRegHeart } from "react-icons/fa6";
import dp from "../assets/dp.jpg";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import OtherUser from './OtherUser';
import Notifications from '../pages/Notifications';
import { useState } from 'react';


const LeftHome = () => {


    const {userData,suggestedUsers}=useSelector
    (state=>state.user)

const [showNotification, setShowNotification] = useState(false)
    const dispatch=useDispatch()
    const {notificationData} =useSelector(state=>state.user)


    const handleLogOut=async()=>{
        try{
            const result=await axios.get(`${serverUrl}/api/auth/signout`,{withCredentials: true})
            dispatch(setUserData(null))
        }
        catch(error){
            console.log(error)
        }
    }


  return (
    <div className={`w-[25%] hidden lg:block h-screen bg-black border-r-2 border-gray-900 ${showNotification?"overflow-hidden":"overflow-auto"}`}>
        <div  className='w-full h-25 flex items-center justify-between p-5'>
            <img src={logo} alt="" className='w-20' />
            <div className='relative z-100 ' onClick={()=>setShowNotification(prev=>!prev)}>
                <FaRegHeart  className='text-[white] w-6.25 h-6.25'/>
                {notificationData?.length>0 && notificationData.some((noti)=>noti.isRead===false) && (<div className='w-2.5 h-2.5 bg-blue-600 rounded-full absolute top-0 -right-1.25'></div>)}
                
            </div>
        </div>


        {!showNotification && 
        <>
          <div className='flex items-center w-full justify-between gap-2.5 px-2.5 border-b-2 border-b-gray-900 py-2.5'>

            <div className='flex items-center gap-2.5' >

            <div className='w-17.5 h-17.5 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                <img src={userData.profileImage || dp} alt=""
                className='w-full object-cover' />
     </div>

     <div>
        <div className='text-4.5 text-white font-semibold'>{userData.userName}</div>
        <div className='text-3.75 text-gray-400 font-semibold'>{userData.name}

        </div>
     </div>

     </div>

     <div className='text-blue-500 font-semibold cursor-pointer' onClick={handleLogOut}>Log Out</div>

        </div>


        <div className='w-full flex flex-col gap-5 p-5'>
            <h1 className='text-white text-5'>Suggested Users</h1>
            {suggestedUsers && suggestedUsers.slice(0,3).map((user,index)=>(
                <OtherUser key={index} user={user}/>


            ))}
            
        </div>

        </>}

        {showNotification && <Notifications/>}

    
    </div>
  )
}

export default LeftHome