import React, { useEffect, useRef, useState } from 'react'
import { FiVolume2 } from "react-icons/fi";
import { FiVolumeX } from "react-icons/fi";
import dp from "../assets/dp.jpg";
import FollowButtton from './FollowButtton';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { MdOutlineComment } from "react-icons/md";
import axios from 'axios';
import { serverUrl } from '../App';
import { setLoopData } from '../redux/loopSlice';
import { setUserData } from '../redux/userSlice';
import { IoSendSharp } from 'react-icons/io5';


const LoopCard = ({ loop }) => {
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const {socket} = useSelector(state => state.socket)

    const { loopData } = useSelector(state => state.loop)
    const [showHeart, setShowHeart] = useState(false)
    const [showComment, setShowComment] = useState(false)
    const [message, setMessage] = useState("")
    const dispatch = useDispatch()

    const commentRef = useRef()
    const videoRef = useRef()
    const [isPlaying, setIsPlaying] = useState(true)
    const [isMute, setIsMute] = useState(true)
    const [progress, setProgress] = useState(0)


    const handleTimeUpdate = () => {
        const video = videoRef.current
        if (video) {
            const percent = (video.currentTime / video.duration) * 100
            setProgress(percent)
        }
    }

    const handleDubleClick = () => {
        setShowHeart(true)
        setTimeout(() => setShowHeart(false), 6000)
        { !loop.likes?.includes(userData._id) ? handleLike() : null }
        //Agar like nhi h to like ho jaayega

    }



    const handleClick = () => {
        if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false)
        }
        else {
            videoRef.current.play()
            setIsPlaying(true)
        }

    }


    const handleLike = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`, { withCredentials: true })
            const updatedLoop = result.data

            const updatedLoops = loopData.map(p => p._id == loop._id ? updatedLoop : p)
            dispatch(setLoopData(updatedLoops))

        }
        catch (error) {
            console.log(error)


        }
    }


    /*Handle Comment*/
    const handleComment = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/loop/comment/${loop._id}`, { message }, { withCredentials: true })
            const updatedLoop = result.data

            const updatedLoops = loopData.map(p => p._id == loop._id ? updatedLoop : p)
            dispatch(setLoopData(updatedLoops))
            setMessage()

        }
        catch (error) {
            console.log(error)


        }
    }

    /*Comment*/

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (commentRef.current && !commentRef.current.contains(event.target)) {
                setShowComment(false)
            }

        }

        if (showComment) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        else {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [showComment])



    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            const video = videoRef.current
            if (entry.isIntersecting) {
                video.play()
                setIsPlaying(true)
            }
            else {
                video.pause()
                setIsPlaying(false)
            }
        }, { threshold: 0.6 })
        if (videoRef.current) {
            observer.observe(videoRef.current)  //Add event Listener
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current) //Remove event listener
            }
        }
    }, [])


    useEffect(()=>{
        socket?.on("likedLoop",(updatedData)=>{
        const updatedLoops = loopData.map(p => p._id == updatedData.loopId?{...p,likes:updatedData.likes}: p)
        dispatch(setLoopData(updatedLoops))
        })
    
        socket?.on("commentedLoop",(updatedData)=>{
        const updatedLoops = loopData.map(p => p._id == updatedData.loopId?{...p,comments:updatedData.comments}: p)
        dispatch(setLoopData(updatedLoops))
        })
    
        return ()=>{socket?.off("likedLoop")
                   socket?.off("commentedLoop")}
      },[socket,dispatch,loopData])
    


    return (
        <div className='w-full lg:w-120 h-screen flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hideen'>

            {showHeart && <div className='absolute top-1/2 left-1/2 transform-translate-x-1/2 -translate-y-1/2 heart-animation z-50'>
                <GoHeartFill className='w-25 h-25 text-white drop-shadow-2xl' />

            </div>}


            <div ref={commentRef} className={`absolute z-200 bottom-0 w-full h-125 p-2.5  rounded-t-4xl bg-[#0e1718] transform transition-transform duration-500 ease-in-out  left-0 shadow-2xl shadow-black ${showComment ? "translate-y-0" : "translate-y-full hidden"}`} >

                <h1 className='text-white text-5 text-center font-semibold'>Comments</h1>

                <div className='w-full h-87.5 overflow-y-auto flex flex-col gap-5'>

                    {loop.comments.length == 0 && <div className='text-center text-white twxt-5 font-semibold mt-12.5'>No Comments Yet</div>}

                    {loop.comments.map((com, index) => (
                        <div className='w-full flex flex-col gap-1.25 border-b-2 border-gray-800 justify-center pb-2.5 mt-2.5'>

                            <div className='flex justify-start items-center gap-2.5 md:gap-5'>
                                <div className='w-7.5 h-7.5 md:w-10 md:h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                                    <img src={com.author?.profileImage || dp} alt=""
                                        className='w-full object-cover' />
                                </div>

                                <div className='w-37.5 font-semibold text-white truncate'>
                                    {com.author?.userName}
                                </div>
                            </div>

                            <div className='text-white pl-15'>{com.message}</div>


                        </div>

                    ))}

                </div>


    <div className='w-full fixed bottom-0  h-20 flex items-center justify-between px-2.5 py-5'>

        <div className='w-7.5 h-7.5 md:w-10 md:h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden '>
            <img src={loop.author?.profileImage || dp} alt=""
                 className='w-full object-cover' />
        </div>

        <input type="text" className='px-2.5 border-b-2 border-b-gray-500 w-[90%] text-white placeholder:text-white outline-none h-10' placeholder='Write Comment...' onChange={(e) => setMessage(e.target.value)} value={message} />

            {message &&
                <button className='absolute right-5 cursor-pointer' onClick={handleComment}><IoSendSharp className='w-6.25 h-6.25 text-white' />

                </button>}
                   
        </div>
    </div>








            <video ref={videoRef} autoPlay muted loop src={loop?.media} className='w-full max-h-full' onClick={handleClick} onTimeUpdate={handleTimeUpdate} onDoubleClick={handleDubleClick} />
            <div className='absolute top-5 z-100 right-5' onClick={() => setIsMute(prev => !prev)}>
                {!isMute ? <FiVolume2 className='w-5 h-5 text-white font-semibold' /> : <FiVolumeX className='w-5 h-5 text-white font-semibold' />}
            </div>

            <div className=' absolute bottom-0  w-full h-1.25 bg-gray-900 '>
                <div className='w-50 h-full bg-white transition-all duration-200 ease-linear' style={{ width: `${progress}%` }}>

                </div>

            </div>

            <div className='w-full absolute h-25 bottom-2.5 p-2.5 flex flex-col gap-2.5'>
                <div className='flex items-center gap-1.25 '>
                    <div className='w-7.5 h-7.5 md:w-10 md:h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={() => navigate(`/profile/${userData.userName}`)}>
                        <img src={loop.author?.profileImage || dp} alt=""
                            className='w-full object-cover' />
                    </div>

                    <div className='w-30 font-semibold truncate text-white'>
                        {loop.author?.userName}
                    </div>


                    <FollowButtton targetUserId={loop.author?._id} tailwind={"px-2.5 py-1.25 text-white  text-[14px] rounded-2xl border-2 border-white"} />
                </div>
                <div className='text-white px-2.5'>
                    {loop.caption}
                </div>



                <div className='absolute right-0 flex flex-col gap-5 text-white bottom-40 justify-center px-2.5'>

                    <div className='flex flex-col items-center cursor-pointer '>
                        <div onClick={handleLike}>
                            {!loop.likes.includes(userData._id) && <GoHeart className='w-6.25 cursor-pointer h-6.25' />}
                            {loop.likes.includes(userData._id) && <GoHeartFill className='w-6.25 cursor-pointer h-6.25 text-red-600' />}

                        </div>
                        <div>{loop.likes.length}</div>
                    </div>


                    <div className='flex flex-col items-center cursor-pointer' onClick={() => setShowComment(true)}>
                        <div><MdOutlineComment className='w-6.25 cursor-pointer h-6.25' /></div>
                        <div>{loop.comments.length}</div>
                    </div>
                </div>

            </div>

        </div>
    )
}



export default LoopCard