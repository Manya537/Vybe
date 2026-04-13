import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchData } from '../redux/userSlice'
import dp from "../assets/dp.jpg"
const Search = () => {
    const navigate=useNavigate()
    const [input, setInput] = useState("")
    const dispatch=useDispatch()
    const { searchData } = useSelector((state) => state.user)

    const handleSearch=async(e)=>{
        try{
            const result=await axios.get(`http://localhost:8000/api/user/search?keyword=${input}`,{
                withCredentials:true
            })
            dispatch(setSearchData(result.data))
        }
        catch(error){
            console.log(error)

        }
    }

    useEffect(()=>{
        handleSearch()
    },[input])

    
  return (
    <div className='w-full min-h-screen bg-black flex items-center flex-col gap-5 absolute top-0'>

        <div  className='w-full h-20 flex items-center gap-5 px-5 '>
                    <IoIosArrowRoundBack className='text-white cursor-pointer w-6.25 h-6.25' onClick={()=>navigate(`/`)}/>

                </div>
                <div className='w-full h-20 flex items-center justify-center mt-20'>
            <form className='w-[90%] max-w-200 h-[80%] rounded-full bg-[#0f1414] flex items-center px-5' >
        <FiSearch className='w-4.5 h-4.5 text-white'/>
        <input type="text" placeholder='Search...' className='w-full h-full outline-0 rounded-full px-5 text-white text-[18px]' onChange={(e)=>setInput(e.target.value)} value={input}/>
        </form>  
    </div>

    {input &&  
    searchData?.map((user)=>(
        <div className='w-[90vw] max-w-175 h-15 rounded-full bg-white flex items-center gap-5 px-1.25 hover:bg-gray-200' onClick={()=>navigate(`/profile/${user.userName}`)}>
            <div className='w-12.5 h-12.5 border-2 border-black rounded-full cursor-pointer overflow-hidden' >
                <img src={user.profileImage || dp} alt="" className='w-full object-cover'/>
            </div>
            <div className='text-black text-[18px]  font-semibold'>
                <div>{user.userName}</div>
                <div className='text-3.5 text-gray-400'>{user.name}

                </div>
            </div>
        </div>

    ))
    }
    {!input && <div className='text-7.5 text-gray-700 font-bold'>Search Here....</div> }




</div>
  )
}

export default Search