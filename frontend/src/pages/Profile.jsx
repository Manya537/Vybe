import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/userSlice'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.jpg"
import Nav from '../components/Nav'
import FollowButtton from '../components/FollowButtton'
import Post from '../components/Post'
import { setSelectedUser } from '../redux/messageSlice'

const Profile = () => {

    const { userName } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [postType,setPostType]=useState("posts")
    const { profileData, userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)


    const handleProfile = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/getProfile/${userName}`, { withCredentials: true })
            dispatch(setProfileData(result.data)) //redux me store krwa liye using dispatch method se 
        }
        catch (error) {
            console.log(error)

        }
    }

    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleProfile()
    }, [userName, dispatch])

    return (
        <div className='w-full min-h-screen bg-black'>
            <div className='w-full h-20 flex justify-between items-center px-7.5 text-white'>

                <div onClick={() => navigate("/")}><IoIosArrowRoundBack className='text-white cursor-pointer w-6.25 h-6.25' /></div>

                <div className='font-semibold text-5'>{profileData?.userName}</div>

                <div className='font-semibold cursor-pointer text-5 text-blue-500' onClick={handleLogOut}>Log Out</div>


            </div>


            <div className='w-full h-37.5 flex items-start gap-5 lg:gap-12.5 pt-5 px-2.5 justify-center '>

                <div className='w-20 h-20 md:w-35 md:h-35 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={profileData?.profileImage || dp} alt=""
                        className='w-full object-cover' />
                </div>

                <div>
                    <div className='font-semibold text-5.5 text-white'>{profileData?.name}</div>
                    <div className='text-4.25 text-[#ffffffe8]'>{profileData?.profession || "New User"}</div>
                    <div className='text-4.25 text-[#ffffffe8]'>{profileData?.bio || "Smasher"}</div>
                </div>
            </div>

            <div className='w-full h-25 flex items-center justify-center gap-10 md:gap-15 px-[20%] pt-7.5 text-white'>
                <div>
                    <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.posts.length}</div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Posts</div>
                </div>
                <div>
                <div className='flex items-center justify-center gap-5'>
  
  {/* 👇 add width here */}
  <div className='relative h-10 w-20'>
    {profileData?.followers?.slice(0, 3).map((user, index) => (
      <div
        key={index}
        className="w-10 h-10 border-2 border-black rounded-full overflow-hidden cursor-pointer absolute"
        style={{
          left: `${index * 18}px`,
          zIndex: 10 - index
        }}
      >
        <img
          src={user?.profileImage || dp}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>

  <div className='text-white text-[22px] md:text-[30px] font-semibold'>
    {profileData?.followers?.length}
  </div>

</div>

                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Followers</div>
                </div>
               <div>
  <div className='flex items-center justify-center gap-5'>
    
    {/* 👇 FIXED container width */}
    <div className="relative h-10 w-20">
      {profileData?.following?.slice(0, 3).map((user, index) => (
        <div
          key={index}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white absolute"
          style={{
            left: `${index * 18}px`,
            zIndex: 10 - index
          }}
        >
          <img
            src={user?.profileImage || dp}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>

    <div className='text-white text-[22px] md:text-[30px] font-semibold'>
      {profileData?.following?.length}
    </div>

  </div>

  <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>
    Following
  </div>
</div>

            </div>

            <div className='w-full h-20 flex justify-center items-center gap-5 mt-2.5'>
                {profileData?._id === userData._id
                    &&
                    <button className='px-2.5 min-w-37.5 py-1.25 h-10 bg-white cursor-pointer rounded-2xl' onClick={() => navigate("/editprofile")}>Edit Profile</button>}

                {profileData?._id !== userData._id
                    &&
                    <>
                        <FollowButtton tailwind={'px-2.5 min-w-37.5 py-1.25 h-10 bg-white cursor-pointer rounded-2xl'} targetUserId={profileData?._id} onFollowChange={handleProfile} />


                        <button className='px-2.5 min-w-37.5 py-1.25 h-10 bg-white cursor-pointer rounded-2xl' onClick={()=>{dispatch(setSelectedUser(profileData))
                        navigate("/messageArea")
                        }}>Message
                        </button>
                    </>
                    }
            </div>

            <div className='w-full min-h-screen flex justify-center'>

                <div className='w-full max-w-225 flex flex-col items-center rounded-t-[30px] bg-white relative gap-5 pt-7.5 pb-25'>


{profileData?._id==userData._id &&   <div className='w-[90%] max-w-125 h-20 bg-white rounded-full flex justify-center items-center gap-2.5'>

                <div
                    className={`${postType == "posts" ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
                    onClick={() => setPostType("posts")}
                >
                    Posts
                </div>

                <div
                    className={`${postType == "saved" ? "bg-black text-white shadow-2xl shadow-black" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
                    onClick={() => setPostType("saved")}
                >
                    Saved
                </div>
            </div>
     }
     
        <Nav />

    {
    profileData?._id==userData._id && <>
        {postType=="posts" && postData.map((post,index)=>(
            post.author?._id==profileData?._id && <Post post={post}/>
    ))}

    {postType=="saved" && postData.map((post,index)=>(
         userData.saved.includes(post._id) && <Post post={post}/>
        ))}</>
    }

    {
    profileData?._id!=userData._id && 
        postData.map((post,index)=>(
            post.author?._id==profileData?._id && <Post post={post}/>
        ))
    }

                    

                </div>

            </div>

        </div>
    )
}

export default Profile