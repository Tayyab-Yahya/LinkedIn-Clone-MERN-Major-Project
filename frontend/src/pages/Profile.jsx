import React, { useContext, useState, useEffect } from 'react'
import Nav from '../components/Nav'
import BlankProfile from "../assets/BlankProfile.png"
import {FiPlus, FiCamera} from "react-icons/fi"; 
import { userDataContext } from '../context/UserContext.jsx';
import {HiPencil} from "react-icons/hi2"; 
import EditProfile from '../components/EditProfile.jsx';
import axios from "axios"
import { authDataContext } from '../context/AuthContext.jsx';
import Post from '../components/Post.jsx'


function Profile() {

    let {userData, setUserData, edit, setEdit, postData, setPostData} = useContext(userDataContext)
    let [userConnections, setUserConnections] = useState([])
    let [profilePost, setProfilePost] = useState([])
    let { serverUrl } = useContext(authDataContext)

    const handleGetUserConnections = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/connection`, {withCredentials: true})
            setUserConnections(result.data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect( ()=> {
        handleGetUserConnections()
    }, [])

    useEffect(()=>{
        setProfilePost(postData.filter((post)=>post.author._id==userData._id));
    }, [])

  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px] pb-[40px]'>
      <Nav />
      {edit && <EditProfile/>}
      <div className='w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px] '>
            <div className='relative pb-[40px] bg-white rounded-lg shadow-lg'>
                {/* Cover Photo */}
                <div className='w-full h-[150px] bg-gray-400 rounded overflow-hidden flex justify-center items-center cursor-pointer' onClick={() => setEdit(true)}>
                <img src={userData.coverImage || ""} alt="" className='w-full'/>
                <FiCamera className='absolute top-[20px] right-[20px] text-white'/>
                </div>
                
                {/* Profile Picture */}
                <div className='text-gray-600 cursor-pointer w-[100px] h-[100px] items-center justify-center absolute top-[95px] left-[25px] rounded-full border-2 border-white' onClick={() => setEdit(true)}>
                    <img src={userData.profileImage || BlankProfile} alt="Profile" className='w-full h-full rounded-full overflow-hidden'/>            
                </div>
                
                {/* Plus Icon */}
                <div className='bg-blue-700 w-[25px] h-[25px] absolute top-[165px] left-[100px] rounded-full flex justify-center items-center text-white cursor-pointer'>
                <FiPlus className='h-[90%] w-[90%]'/>
                </div>

                {/* User Info */}
                <div className="mt-[60px] ml-[15px]">
                <div className="font-bold text-gray-700 text-[24px]">{`${userData.firstName} ${userData.lastName}`}</div>
                <div className="text-[16px] font-semibold text-gray-700">{userData.headline}</div>
                <div className="text-gray-500 text-[16px]">{userData.location}</div>
                <div className="text-blue-500 text-[16px] mt-[10px] font-semibold">{userConnections.length} connections</div>
                </div>
                
                <button className='ml-[12px] min-w-[150px] h-[40px] bg-white hover:text-white text-blue-800 py-[5px] px-[10px] rounded-full hover:bg-blue-600 border-2 border-blue-500 my-[20px] flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>Edit Profile <HiPencil/></button>
            </div>

            <div className='w-full min-h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg rounded-lg'>
                {`Posts (${profilePost.length})`}
            </div>

            {profilePost.map((post, index)=>(
                <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt}/>
            ))}

            {userData.skills.length>0 && <div  className='w-full min-h-[100px] flex flex-col gap-[10px] jusify-center p-[20px] bg-white shadow-lg rounded-lg'>
                <div className='text-[22px] text-gray-600 font-semibold'>
                    {`Skills (${userData.skills.length})`}
                </div>
                <div className='flex flex-wrap justify-start items-center gap-[10px] text-[17px] text-gray-600 font-semibold p-[20px]'>
                    {userData.skills.map((skill)=>(
                        <div>{skill}</div>
                    ))}
                    <button className="w-[12%] h-[37px] bg-blue-500 text-white py-[5px] px-[10px] rounded-full hover:bg-blue-600 border-2 border-blue-500" onClick={()=>setEdit(true)}>Add skill</button>
                </div>
            </div>}

        </div>
    </div>
  )
}

export default Profile
