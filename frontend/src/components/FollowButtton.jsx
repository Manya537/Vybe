import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { toggleFollow } from '../redux/userSlice'

const FollowButtton = ({targetUserId,tailwind,onFollowChange}) => {
  const {following}=useSelector(state=>state.user)
  const isFollwing=following?.includes(targetUserId)
  const dispatch=useDispatch()

  const handleFollow=async()=>{
    try{
      const result=await axios.get(`${serverUrl}/api/user/follow/${targetUserId}`,{withCredentials: true})

      if(onFollowChange){
        onFollowChange()
      }
      dispatch(toggleFollow(targetUserId))
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <button className={tailwind} onClick={handleFollow}>
      {isFollwing?"Following":"Follow"}

    </button>
  )
}

export default FollowButtton