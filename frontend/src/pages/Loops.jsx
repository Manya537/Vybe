import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LoopCard from '../components/LoopCard'

const Loops = () => {
    const navigate=useNavigate()
    const {loopData}=useSelector(state=>state.loop)
  return (  
    <div className='w-screen h-screen bg-black overflow-hidden flex justify-center items-center'>
                <div  className='w-full h-20 flex items-center gap-5 px-5 fixed top-5 left-2.5 z-100'>
                    <IoIosArrowRoundBack className='text-white cursor-pointer w-6.25 h-6.25' onClick={()=>navigate(`/`)}/>
                    <h1 className='text-white text-[20px] font-semibold'>Loops</h1>
                </div>

            <div className='h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide'>
        {loopData.map((loop,index)=>(
            <div className='h-screen snap-start'>
                <LoopCard loop={loop} key={index}/>
            </div>
        ))}
    </div>
</div>
  )
}

export default Loops