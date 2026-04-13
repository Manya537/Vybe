import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { LuImage } from 'react-icons/lu'
import { IoMdSend } from 'react-icons/io'

import dp from "../assets/dp.jpg"
import axios from 'axios'
import { serverUrl } from '../App'
import { setMessages } from '../redux/messageSlice'
import Messages from './Messages'
import SenderMessage from '../components/SenderMessage'
import RecieverMessage from '../components/RecieverMessage'


const MessageArea = () => {

  const {selectedUser,messages}=useSelector(state=>state.message)
    const {userData}=useSelector(state=>state.user)
    const {socket}=useSelector(state=>state.socket)



  const navigate=useNavigate()
  const [input, setInput] = useState("")
  const dispatch=useDispatch()
  const imageInput=useRef()

  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)

  const handleImage=(e)=>{
    const file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))

  }

  const handleSendMessage=async(e)=>{
    e.preventDefault()
    try{
      const formData=new FormData()
      formData.append("message",input)
      if(backendImage){
        formData.append("image",backendImage)
      }

      const result=await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`,formData,{withCredentials: true})
      dispatch(setMessages([...messages,result.data]))  //Phle ka message to rhega hi sath Hi abhi wala message add ho jaayega
      setInput("")
      setBackendImage(null)
      setFrontendImage(null)
    }
    catch(error){
      console.log(error)
    }
  }


  const getAllMessages=async()=>{
    try{
      const result=await axios.get(`${serverUrl}/api/message/getAll/${selectedUser._id}`,{withCredentials: true})
      dispatch(setMessages(result.data))
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    getAllMessages()

  },[])

  //Socket real time me message krega  uske liye useEfect
  useEffect(()=>{
    socket?.on("newMessage",(mess)=>{
      dispatch(setMessages([...messages,mess]))
    })
    return ()=>socket?.off("newMessage")

  },[messages,setMessages])
  
  return (
    <div className='w-full h-screen bg-black relative'>

      <div className='w-full flex items-center gap-3.75 px-5 py-2.5 fixed top-0 z-100 bg-black '>

        <div  className=' h-20 flex items-center gap-5 px-5'>
                    <IoIosArrowRoundBack className='text-white cursor-pointer w-6.25 h-6.25' onClick={()=>navigate(`/`)}/>
                    
                </div>

         <div className='w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={() => navigate(`/profile/${selectedUser.userName}`)}>
           <img src={selectedUser.profileImage || dp} alt=""
               className='w-full object-cover' />
          </div>

          <div className='text-white text-4.5 font-semibold '>
            <div>{selectedUser.userName}</div>
            <div className='text-[14px] text-gray-400'>{selectedUser.name}</div>
          </div> 
        

      </div>


      <div className='w-full h-[80%] pt-25  px-10 flex flex-col gap-12.5 overflow-auto bg-black'>

       {messages && messages.map((mess, index) => (
  mess.sender === userData._id 
    ? <SenderMessage key={index} message={mess}/> 
    : <RecieverMessage key={index} message={mess}/>
))}

        

      </div>

      <div className='w-full h-20 fixed bottom-0 flex justify-center items-center bg-black z-100'> 

        <form className=' w-[90%] max-w-200 h-[80%] rounded-full bg-[#131616] flex items-center gap-2.5 px-5 relative' onSubmit={handleSendMessage}>

          {frontendImage &&  
          <div className='w-25 rounded-2xl h-25 absolute -top-30 right-2.5 overflow-hidden'>
            <img src={frontendImage} alt="" className='h-full object-cover'/>

          </div>
          }

         

          <input type="file" accept='image/*' hidden ref={imageInput} onChange={handleImage}/>

          <input type="text" placeholder='Message' className='w-full h-full px-5 text-4.5 text-white outline-0' onChange={(e)=>setInput(e.target.value)} value={input}/>

          <div onClick={()=>imageInput.current.click()}><LuImage className='w-6 h-6 text-white'/></div>

        {(input || frontendImage) && <button className='w-15 h-10 rounded-full bg-linear-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center cursor-pointer'><IoMdSend className='w-6.25 h-6.25 text-white'/></button>}

       


        </form>
      </div>

      
        

    </div>
  )
}

export default MessageArea