import React, { useRef, useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { CiSquarePlus } from "react-icons/ci";
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { setCurrentUserStory, setStoryData } from '../redux/storySlice';
import { setLoopData } from '../redux/loopSlice';
import { ClipLoader } from 'react-spinners';
import { setUserData } from '../redux/userSlice';


const Upload = () => {

    const navigate = useNavigate()
    const [uploadType, setUploadType] = useState("story")
    const [frontendMedia, setFrontendMedia] = useState(null)
    const [backendMedia, setBackendMedia] = useState(null)
    const [mediaType, setMediaType] = useState("")
    const [caption, setCaption] = useState("")
    const mediaInput = useRef()
    const dispatch=useDispatch()
    const {postData}=useSelector(state=>state.post)
    const {storyData}=useSelector(state=>state.story)
    const {loopData}=useSelector(state=>state.loop)
    const [loading, setLoading] = useState(false)
    const handleMedia = (e) => {
        const file = e.target.files[0]
        console.log(file)
        if (file.type.includes("image")) {
            setMediaType("image")
        }
        else {
            setMediaType("video")
        }
        setBackendMedia(file)
        setFrontendMedia(URL.createObjectURL(file))
    }

    const uploadPost=async()=>{
        setLoading(true)
        try{
            const formData=new FormData()
            formData.append("caption",caption)
            formData.append("mediaType",mediaType)
            formData.append("media",backendMedia)
            const result=await axios.post(`${serverUrl}/api/post/upload`,formData,{withCredentials: true})
            dispatch(setPostData([...postData,result.data]))
            setLoading(false)
            navigate("/")

        }
        catch(error){
            console.log(error)

        }
    }


    const uploadStory=async()=>{
        setLoading(true)
        try{
            const formData=new FormData()
            formData.append("mediaType",mediaType)
            formData.append("media",backendMedia)
            const result=await axios.post(`${serverUrl}/api/story/upload`,formData,{withCredentials: true})
            dispatch(setCurrentUserStory(result.data))
            setLoading(false)
            navigate("/")
        }
        catch(error){
            console.log(error)

        }
    }

    const uploadLoop=async()=>{
        setLoading(true)
        try{
            const formData=new FormData()
            formData.append("caption",caption)
            formData.append("media",backendMedia)
            const result=await axios.post(`${serverUrl}/api/loop/upload`,formData,{withCredentials: true})
            dispatch(setLoopData([...loopData,result.data]))
            setLoading(false)
            navigate("/")
        }
        catch(error){
            console.log(error)

        }
    }

    const handleUpload=()=>{
        setLoading(true)
        if(uploadType=="post"){
            uploadPost()
        }
        else if(uploadType=="story"){
            uploadStory()
        }
        else{
            uploadLoop()
        }
    }



    return (
        <div className='w-full h-screen bg-black flex flex-col items-center'>

            <div className='w-full h-20 flex items-center gap-5 px-5'>
                <IoIosArrowRoundBack
                    className='text-white cursor-pointer w-6 h-6'
                    onClick={() => navigate('/')}
                />
                <h1 className='text-white text-xl font-semibold'>Upload Media</h1>
            </div>

            <div className='w-[90%] max-w-150 h-20 bg-white rounded-full flex justify-around items-center gap-2.5'>

               

                <div
                    className={`${uploadType == "post" ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
                    onClick={() => setUploadType("post")}
                >
                    Post
                </div>

                <div
                    className={`${uploadType == "story" ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
                    onClick={() => setUploadType("story")}
                >
                    Story
                </div>

                <div
                    className={`${uploadType == "loop" ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
                    onClick={() => setUploadType("loop")}
                >
                    Loop
                </div>
            </div>

            {!frontendMedia && <div className='w-[80%] max-w-125 h-62.5 bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-2 mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]' onClick={() => mediaInput.current.click()}>
                <input type="file" accept={uploadType=="loop"?"video/*":""} hidden ref={mediaInput} onChange={handleMedia} />

                <CiSquarePlus className='text-white cursor-pointer w-6.25 h-6.25' />
                <div className='text-white text-[19px] font-semibold'>
                    Upload {uploadType}
                </div>


            </div>
            }

            {frontendMedia &&
                (<div className='w-[80%] max-w-125 h-62.5 flex flex-col items-center justify-center gap-2 mt-[15vh]'>
                    {mediaType == "image" && (<div className='w-[80%] max-w-125 h-62.5 flex flex-col items-center justify-center mt-[5vh]'>
                        <img src={frontendMedia} alt="" className='h-[60%] rounded-2xl' />

                        {uploadType != "story" && <input type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-2.5 py-1.25 text-white mt-5' placeholder='Write caption' onChange={(e) => setCaption(e.target.value)} value={caption}/>}
                    </div>)}

              {mediaType == "video" && (<div className='w-[80%] max-w-125 h-62.5 flex flex-col items-center justify-center mt-[5vh]'>
                        <VideoPlayer media={frontendMedia} />

                        {uploadType != "story" && <input type="text" className='w-full border-b-gray-400 border-b-2 outline-none px-2.5 py-1.25 text-white mt-5' placeholder='Write caption' onChange={(e) => setCaption(e.target.value)} value={caption} />}



                    </div>)}

                </div>)}
            {frontendMedia && (<button className='px-2.5 w-[60%] max-w-100 py-1.25 h-12.5 bg-white mt-12.5 cursor-pointer rounded-2xl' onClick={handleUpload}>
                {loading?<ClipLoader size={30} color='black'/>:`Upload ${uploadType}` }</button>)}
        </div>
    )
}

export default Upload
