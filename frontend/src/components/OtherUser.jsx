import React from 'react'
import dp from "../assets/dp.jpg";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FollowButtton from './FollowButtton';

const OtherUser = ({ user }) => {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  return (
    <div className='w-full h-20 flex items-center justify-between border-b-2 border-gray-800'>

      <div className='flex items-center gap-2.5' >

        <div className='w-12.5 h-12.5 border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={() => navigate(`/profile/${user.userName}`)}>
          <img src={user.profileImage || dp} alt=""
            className='w-full object-cover' />
        </div>

        <div>
          <div className='text-4.5 text-white font-semibold'>{user.userName}</div>
          <div className='text-3.75 text-gray-400 font-semibold'>{user.name}</div>
        </div>
      </div>
      <FollowButtton tailwind={'px-2.5 w-25 py-1.25 h-10 bg-white rounded-2xl'} targetUserId={user._id} />
    </div>
  )
}

export default OtherUser