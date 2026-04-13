import React, { useDebugValue } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedUser } from '../redux/messageSlice'
import dp from "../assets/dp.jpg"
const OnlineUser = ({user}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    
  return (
    <div className='w-15 h-15 flex gap-5 justify-start items-center relative
    '>
            <div className='w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={() =>{
                dispatch(setSelectedUser(user))
                navigate(`/messageArea`)
            }}>
                  <img src={user.profileImage || dp} alt=""
                    className='w-full object-cover' />
                </div>

                <div className='w-2.5 h-2.5 bg-[#0080ff] rounded-full absolute top-0 right-0'>

                </div>


    <div>

    </div>
        


    </div>
  )
}

export default OnlineUser