import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.jpg"
import { IoIosArrowRoundBack } from 'react-icons/io'
import { IoEyeSharp } from "react-icons/io5";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import VideoPlayer from './VideoPlayer'

const StoryCardComp = ({ storyData }) => {
  const { userData } = useSelector(state => state.user)
  const [showViewers, setShowViewers] = useState(false) // Changed to false initially
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          navigate("/")
          return 100
        }
        return prev + 1
      })
    }, 150)

    return () => clearInterval(interval)
  }, [navigate])

  return (
    <div className='w-full max-w-125 h-screen border-x-2 border-gray-800 pt-2.5 relative flex flex-col justify-center'>

      {/* Progress Bar */}
      <div className='absolute top-2.5 w-full h-1.25 bg-gray-900'>
        <div className='h-full bg-white transition-all duration-200 ease-linear' style={{ width: `${progress}%` }}></div>
      </div>

      {/* Header */}
      <div className='flex items-center gap-2.5 absolute top-7.5 px-2.5 z-10'>
        <IoIosArrowRoundBack className='text-white cursor-pointer w-6.25 h-6.25' onClick={() => navigate(`/`)} />
        <div className='w-7.5 h-7.5 md:w-10 md:h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
          <img src={storyData?.author?.profileImage || dp} alt="" className='w-full object-cover' />
        </div>
        <div className='w-30 font-semibold truncate text-white'>{storyData?.author?.userName}</div>
      </div>

      {/* Story View Mode */}
      {!showViewers && (
        <>
          <div className='w-full h-[90%] flex items-center justify-center'>
            {storyData?.mediaType === "image" && (
              <div className='w-[80%] flex flex-col items-center justify-center'>
                <img src={storyData.media} alt="" className='w-full rounded-2xl object-cover' />
              </div>
            )}

            {storyData?.mediaType === "video" && (
              <div className='w-[80%] flex flex-col items-center justify-center'>
                <VideoPlayer media={storyData.media} />
              </div>
            )}
          </div>

          {/* Viewers Preview (for story owner) */}
          {storyData?.author?.userName === userData?.userName && (
            <div 
              className='w-full flex items-center gap-2.5 text-white h-17.5 bottom-0 p-2 left-0 cursor-pointer'
              onClick={() => setShowViewers(true)}
            >
              <div className='text-white flex items-center gap-1.25'>
                <IoEyeSharp />{storyData.viewers?.length || 0}
              </div>

              <div className='relative h-10 w-20'>
                {storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                  <div
                    key={viewer._id || index}
                    className="w-7.5 h-7.5 border-2 border-black rounded-full overflow-hidden cursor-pointer absolute"
                    style={{
                      left: `${index * 10}px`,
                      zIndex: 10 - index
                    }}
                  >
                    <img
                      src={viewer?.profileImage || dp}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Viewers List Mode */}
      {showViewers && (
        <>
          <div className='w-full h-[30vh] flex items-center justify-center mt-25 py-7.5 overflow-hidden'>
            {storyData?.mediaType === "image" && (
              <div className='h-full flex items-center justify-center'>
                <img src={storyData?.media} alt="" className='h-[80%] rounded-2xl object-cover' />
              </div>
            )}

            {storyData?.mediaType === "video" && (
              <div className='h-full flex flex-col items-center justify-center'>
                <VideoPlayer media={storyData?.media} />
              </div>
            )}
          </div>

          <div className='w-full h-[70%] border-t-2 border-t-gray-800 p-5 text-white overflow-auto'>
            <div className='flex items-center gap-2 mb-5 cursor-pointer' onClick={() => setShowViewers(false)}>
              <IoEyeSharp className='text-xl' />
              <span className='font-semibold'>{storyData?.viewers?.length || 0}</span>
              <span>Viewers</span>
            </div>

            <div className='w-full flex flex-col gap-2.5'>
              {storyData?.viewers?.map((viewer, index) => (
                <div key={index} className='w-full  flex items-center gap-5 p-2 hover:bg-gray-800 rounded-lg'>
                  <div className='w-7.5 h-7.5 md:w-10 md:h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={viewer?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                  </div>
                  <div className='font-semibold truncate text-white'>{viewer?.userName}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default StoryCardComp