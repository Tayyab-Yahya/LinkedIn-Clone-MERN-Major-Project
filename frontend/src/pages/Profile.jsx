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
import ConnectionButton from '../components/ConnectionButton.jsx';


function Profile() {

    let {userData, setUserData, edit, setEdit, postData, setPostData, profileData, setProfileData, handleGetProfile} = useContext(userDataContext)
    let [profilePost, setProfilePost] = useState([])
    let { serverUrl } = useContext(authDataContext)

    useEffect(()=>{
        setProfilePost(postData.filter((post)=>post.author._id==profileData._id));
    }, [profileData])

  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px] pb-[40px]'>
      <Nav />
      {edit && <EditProfile/>}
      <div className='w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px] '>
            <div className='relative pb-[40px] bg-white rounded-lg shadow-lg'>
                {/* Cover Photo */}
                <div className='w-full h-[150px] bg-gray-400 rounded overflow-hidden flex justify-center items-center cursor-pointer' onClick={() => setEdit(true)}>
                <img src={profileData.coverImage || "/"} alt="" className='w-full'/>
                <FiCamera className='absolute top-[20px] right-[20px] text-white'/>
                </div>
                
                {/* Profile Picture */}
                <div className='text-gray-600 cursor-pointer w-[100px] h-[100px] items-center justify-center absolute top-[95px] left-[25px] rounded-full border-2 border-white' onClick={() => setEdit(true)}>
                    <img src={profileData.profileImage || BlankProfile} alt="Profile" className='w-full h-full rounded-full overflow-hidden'/>            
                </div>
                
                {/* Plus Icon */}
                <div className='bg-blue-700 w-[25px] h-[25px] absolute top-[165px] left-[100px] rounded-full flex justify-center items-center text-white cursor-pointer'>
                <FiPlus className='h-[90%] w-[90%]'/>
                </div>

                {/* User Info */}
                <div className="mt-[60px] ml-[15px]">
                    <div className="font-bold text-gray-700 text-[24px]">{`${profileData.firstName} ${profileData.lastName}`}</div>
                    <div className="text-[16px] font-semibold text-gray-700">{profileData.headline}</div>
                    <div className="text-gray-500 text-[16px]">{profileData.location}</div>
                    <div className="text-blue-500 text-[16px] mt-[10px] font-semibold">{profileData?.connection?.length} connections</div>
                </div>
                
                {profileData._id == userData._id && 
                <button className='ml-[12px] min-w-[150px] h-[40px] bg-white hover:text-white text-blue-800 py-[5px] px-[10px] rounded-full hover:bg-blue-600 border-2 border-blue-500 my-[20px] flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>Edit Profile <HiPencil/></button> }

                {profileData._id != userData._id && <div className='p-[10px]'><ConnectionButton userId={profileData._id}/></div> }
            </div>

            <div className='w-full min-h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg rounded-lg'>
                {`Posts (${profilePost.length})`}
            </div>

            {profilePost.map((post, index)=>(
                <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt}/>
            ))}

            {profileData?.skills?.length>0 && <div  className='w-full min-h-[100px] flex flex-col gap-[10px] jusify-center p-[20px] bg-white shadow-lg rounded-lg'>
                <div className='text-[22px] text-gray-600 font-semibold'>
                    {`Skills (${profileData.skills.length})`}
                </div>
                <div className='flex flex-wrap justify-start items-center gap-[10px] text-[17px] text-gray-600 font-semibold p-[20px]'>
                    {profileData.skills.map((skill, index)=>(
                        <div key={index}>{skill}</div>
                    ))}
                    <div>
                        {profileData._id == userData._id && 
                        <button className="min-w-[12%] h-[37px] bg-blue-500 text-white py-[5px] px-[10px] rounded-full hover:bg-blue-600 border-2 border-blue-500" onClick={()=>setEdit(true)}>Add skill</button>}
                    </div>
                </div>
            </div>}

            {profileData?.education?.length>0 && <div  className='w-full min-h-[100px] flex flex-col gap-[10px] jusify-center p-[20px] bg-white shadow-lg rounded-lg'>
                <div className='text-[22px] text-gray-600 font-semibold'>
                    Education
                </div>
                <div className='flex flex-col justify-start items-start gap-[10px] text-[17px] text-gray-600 font-semibold p-[20px]'>
                    {profileData.education.map((edu, index)=>(
                        <div key={index} className='flex flex-col gap-[5px]'>
                            <div>College: <span className='font-normal'>{edu.college}</span></div>
                            <div>Degree: <span className='font-normal'>{edu.degree}</span></div>
                            <div>Field of Study: <span className='font-normal'>{edu.fieldOfStudy}</span></div>
                        </div>
                    ))}
                    {profileData._id == userData._id && 
                    <button className="min-w-[12%] h-[37px] bg-blue-500 text-white py-[5px] px-[12px] rounded-full hover:bg-blue-600 border-2 border-blue-500" onClick={()=>setEdit(true)}>Add education</button>}
                </div>
            </div>}

            {profileData?.experience?.length>0 && <div  className='w-full min-h-[100px] flex flex-col gap-[10px] jusify-center p-[20px] bg-white shadow-lg rounded-lg'>
                <div className='text-[22px] text-gray-600 font-semibold'>
                    Experience
                </div>
                <div className='flex flex-col justify-start items-start gap-[10px] text-[17px] text-gray-600 font-semibold p-[20px]'>
                    {profileData.experience.map((exp, index)=>(
                        <div key={index} className='flex flex-col gap-[5px]'>
                            <div>Title: <span className='font-normal'>{exp.title}</span></div>
                            <div>Company: <span className='font-normal'>{exp.company}</span></div>
                            <div>Description: <span className='font-normal'>{exp.description}</span></div>
                        </div>
                    ))}
                    {profileData._id == userData._id && 
                    <button className="min-w-[12%] h-[37px] bg-blue-500 text-white py-[5px] px-[12px] rounded-full hover:bg-blue-600 border-2 border-blue-500" onClick={()=>setEdit(true)}>Add experience</button>}
                </div>
            </div>}

        </div>
    </div>
  )
}

export default Profile
