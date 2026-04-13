import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setFollowing } from '../redux/userSlice'


const getFollowingList = () => {
    const dispatch=useDispatch()
    const {storyData}=useSelector(state=>state.story)

    useEffect(()=>{
        const fetchUser=async()=>{
            try{
                const result=await axios.get(`${serverUrl}/api/user/followingList`,{withCredentials: true})
                dispatch(setFollowing(result.data))
                }
            catch(error){
                console.log(error)
            }
        }
        fetchUser()
    },[storyData])
 
}

export default getFollowingList