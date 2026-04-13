import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { GoSearch } from "react-icons/go";
import { RxVideo } from "react-icons/rx";
import { CiSquarePlus } from "react-icons/ci";
import dp from "../assets/dp.jpg";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Nav = () => {
    const navigate=useNavigate()
    const {userData}=useSelector(state=>state.user)
  return (
    <div className='w-[90%] lg:w-[40%] h-20 bg-black flex justify-around items-center fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full shadow-2xl shadow-black z-100'>

    <div onClick={()=>navigate("/")}>
        <GoHomeFill className='text-white cursor-pointer text-2xl'/>
    </div>

    <div onClick={()=>navigate("/search")}>
        <GoSearch className='text-white cursor-pointer text-2xl'/>
    </div>

    <div onClick={()=>navigate("/loops")}>
        <RxVideo className='text-white cursor-pointer text-2xl' />
    </div>

    <div onClick={()=>navigate("/upload")}>
        <CiSquarePlus className='text-white cursor-pointer text-2xl' />
    </div>

    <div className='w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${userData.userName}`)}>
        <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover' />
    </div>

</div>

  )
}

export default Nav