import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { useParams } from 'react-router-dom'
import { setStoryData } from '../redux/storySlice'
import StoryCardComp from '../components/StoryCardComp'
import axios from 'axios'

const Story = () => {
    const {userName} = useParams()
    const dispatch = useDispatch()
    const {storyData} = useSelector(state => state.story)
    
    const handleStory = async() => {
        dispatch(setStoryData(null)) // Changed from [] to null
        try {
            const result = await axios.get(`${serverUrl}/api/story/getByUserName/${userName}`, {withCredentials: true})
            console.log(result.data); 
            // Check if result.data is an array or object
            dispatch(setStoryData(result.data.length ? result.data[0] : result.data))
        }
        catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(userName) {
            handleStory()
        }
    }, [userName])

    return (
        <div className='w-full h-screen bg-black flex justify-center items-center'>
            {storyData && <StoryCardComp storyData={storyData}/>}
        </div>
    )
}

export default Story