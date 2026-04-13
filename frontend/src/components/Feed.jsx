import React from 'react'
import logo from "../assets/logo1.jpg";
import { FaRegHeart } from "react-icons/fa6";
import StoryCard from './StoryCard';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import { BiMessageAltDetail } from 'react-icons/bi';
import Post from './Post';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const { postData } = useSelector(state => state.post)
  const { userData, notificationData } = useSelector(state => state.user)
  const { storyList, currentUserStory } = useSelector(state => state.story)
  const navigate = useNavigate()
  return (
    <div className='lg:w-[50%] w-full bg-black min-h-screen lg:h-screen relative lg:overflow-y-auto'>

      <div className='w-full h-25 flex items-center justify-between p-5 lg:hidden'>
        <img src={logo} alt="" className='w-20' />
        <div className='flex items-center gap-2.5'>
          <div className='relative' onClick={()=>navigate("/notifications")}>
            <FaRegHeart className='text-[white] w-6.25 h-6.25' />
            {notificationData?.length > 0 && notificationData.some((noti) => noti.isRead === false) && (<div className='w-2.5 h-2.5 bg-blue-600 rounded-full absolute top-0 -right-1.25'></div>)}

          </div>
          <BiMessageAltDetail className='text-white w-6.25 h-6.25' onClick={() => navigate("/messages")} />
        </div>
      </div>

      <div className='flex w-full overflow-auto gap-2.5 items-center p-5'>
        <StoryCard userName={"Your Story"} profileImage={userData.profileImage} story={currentUserStory} />

        {storyList?.map((story, index) => (

          <StoryCard userName={story.author.userName} profileImage={story.author.profileImage} story={story} key={index} />

        ))}


      </div>

      <div className='w-full min-h-screen flex flex-col items-center gap-5 p=2.5 pt-10 bg-white rounded-t-[60px] relative pb-30'>

        <Nav />
        {postData?.map((post, index) => (
          <Post post={post} key={index} />
        ))}

      </div>

    </div>
  )
}

export default Feed