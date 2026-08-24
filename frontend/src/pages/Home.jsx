import React, {useContext, useState, useRef, useEffect} from 'react'
import Nav from '../components/Nav.jsx'
import Post from '../components/Post.jsx';
import BlankProfile from "../assets/BlankProfile.png"
import {FiPlus, FiCamera} from "react-icons/fi"; 
import {HiPencil} from "react-icons/hi2"; 
import { userDataContext } from '../context/UserContext.jsx';
import { authDataContext } from '../context/AuthContext.jsx';
import EditProfile from '../components/EditProfile.jsx';
import { MdSmartDisplay } from "react-icons/md";
import { HiMiniPhoto } from "react-icons/hi2";
import { BsImage } from "react-icons/bs";
import { RiArticleFill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import axios from "axios"

function Home() {

  let {userData, setUserData, edit, setEdit, postData, setPostData, getPost, handleGetProfile, getCurrentUser} = useContext(userDataContext)
  let {serverUrl} = useContext(authDataContext)

  let [frontendImage, setFrontendImage] = useState("")
  let [backendImage, setBackendImage] = useState("")
  let [description, setDescription] = useState("")
  let [uploadPost, setUploadPost] = useState(false)
  let [posting, setPosting] = useState(false)
  let [suggestedUsers, setSuggestedUsers] = useState([])

  let image = useRef();

  function handleImage(e) {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  async function handleUploadPost() {
    setPosting(true)
    try {
      let formdata = new FormData()
      formdata.append("description", description);
      if(backendImage){
        formdata.append("image", backendImage);
      }
      let result = await axios.post(serverUrl+"/api/post/create", formdata, {withCredentials: true})
      console.log(result)
      setPosting(false)
      setUploadPost(false)
    } catch(e) {
      setPosting(false)
      console.log(e);
    }
  }

  const handleSuggestedUsers = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/suggestedusers`, {withCredentials: true})
      setSuggestedUsers(result.data)
    
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(()=>{
    handleSuggestedUsers()
  }, [])

  useEffect(()=>{
    getPost()
  }, [uploadPost])

  return (
    <div className="w-full min-h-[100vh] bg-[#f0efe7] pt-[90px] md:pt-[100px] gap-[20px] flex justify-center items-center lg:items-start px-[10px] md:px-[50px] lg:flex-row flex-col relative pb-[50px]">

        {edit && <EditProfile/>}
        <Nav/>

        <div className='min-h-[200px] w-full lg:w-[25%] bg-white shadow-lg rounded-lg p-[10px] relative'>
          
          {/* Cover Photo */}
          <div className='w-full h-[100px] bg-gray-400 rounded overflow-hidden flex justify-center items-center cursor-pointer' onClick={() => setEdit(true)}>
            <img src={userData.coverImage || ""} alt="" className='w-full'/>
            <FiCamera className='absolute top-[20px] right-[20px] text-white'/>
          </div>
          
          {/* Profile Picture */}
          <div className='text-gray-600 cursor-pointer w-[60px] h-[60px] items-center justify-center absolute top-[85px] left-[35px] rounded-full border-2 border-white' onClick={() => setEdit(true)}>
              <img src={userData.profileImage || BlankProfile} alt="Profile" className='w-full h-full rounded-full overflow-hidden'/>              
          </div>
          
          {/* Plus Icon */}
          <div className='bg-blue-700 w-[20px] h-[20px] absolute top-[125px] left-[74px] rounded-full flex justify-center items-center text-white cursor-pointer'>
            <FiPlus />
          </div>

          {/* User Info */}
          <div className="mt-[40px] md:mt-[50px] ml-[15px]">
            <div className="font-medium text-gray-700 text-[22px]">{`${userData.firstName} ${userData.lastName}`}</div>
            <div className="text-[16px] text-gray-700">{userData.headline}</div>
            <div className="text-gray-500 text-[16px]">{userData.location}</div>
          </div>
          
          <button className='w-[100%] h-[40px] bg-white hover:text-white text-blue-800 py-[5px] px-[10px] rounded-full hover:bg-blue-600 border-2 border-blue-500 my-[10px] md:my-[20px] flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>Edit Profile <HiPencil/></button>

        </div>

        {/* Dark background Div */}
        { uploadPost && <div className="w-full h-full bg-black fixed top-0 z-[100] opacity-[0.6] left-0"></div>}

        {/* Create a post Popup */}       
        { uploadPost && <div className=" z-[200] bg-white shadow-lg rounded-lg fixed w-[90%] max-w-[500px] h-[500px] top-[60px] p-[20px] flex items-start justify-start flex-col gap-[20px]">
          <div
          className="absolute top-[15px] right-[15px] cursor-pointer"
          onClick={() => {setUploadPost(false); setFrontendImage("");}}
          >
            <RxCross1 className="h-[20px] w-[20px] text-gray-800 font-bold" />
          </div>

          <div className="flex justify-start items-center gap-[10px]">
            {/* Profile Picture */}
            <div className='cursor-pointer w-[50px] h-[50px] flex items-center justify-center rounded-full border-2 border-white overflow-hidden'>
                <img src={userData.profileImage || BlankProfile} alt="Profile" className='w-full h-full rounded-full overflow-hidden'/>              
            </div>
            <div className="font-medium text-gray-700 text-[22px]">{`${userData.firstName} ${userData.lastName}`}</div>
          </div>

          <textarea className={`text-[17px] w-full ${frontendImage? "h-[200px]":"h-[550px]"} outline-none border-none p-[10px] resize-none`} placeholder="what do you want to talk about?" value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>

          <input hidden type="file" ref={image} onChange={handleImage}/>
          <div className="w-full h-[300px] flex justify-center items-center overflow-hidden">
            <img src={frontendImage || null} alt="" className="h-full rounded-lg"/>
          </div>

          <div className="w-full h-[200px] flex-col flex">
            <div className="p-[20px] flex items-center justify-start border-b-2 border-gray-400">
              <BsImage className="h-[22px] w-[22px] text-gray-500 cursor-pointer" onClick={()=>image.current.click()}/>
            </div>

            <div className="flex justify-end items-end">
              <button className="w-[100px] h-[40px] bg-blue-500 text-white py-[5px] px-[10px] rounded-full hover:bg-blue-600 border-2 border-blue-500 my-[20px] flex items-center justify-center" onClick={handleUploadPost} disabled={posting}>{posting? "Posting...": "Post"}</button>
            </div>
          </div>
        </div> }

        {/* Central section */}
        <div className='min-h-[200px] w-full lg:w-[50%] bg-[#f0efe7] flex flex-col gap-[20px]'>
          <div className='h-[120px] w-full rounded-lg shadow-lg bg-white py-[10px]'>
            
            {/* Create a post searchbar*/}
            <div className='flex justify-center items-center gap-[10px] px-[5px]'>             
              {/* Profile Picture */}
              <div className='text-gray-600 cursor-pointer w-[50px] h-[50px] items-center justify-center rounded-full border-2 border-white' onClick={() => setEdit(true)}>
                  <img src={userData.profileImage || BlankProfile} alt="Profile" className='w-full h-full rounded-full overflow-hidden'/>              
              </div>
              {/* Start a post button */}
              <button className='w-[80%] h-[48px] rounded-full bg-white border-2 border-gray-400 flex items-center justify-start hover:bg-gray-300' onClick={()=>setUploadPost(true)}><p className='ml-[15px] font-semibold text-[16px] text-gray-700'>Start a post</p></button>
            </div>
            <div className="flex justify-around items-center py-[15px] px-[5px]">

              <div className="flex justify-center items-center cursor-pointer gap-[10px]">
                <MdSmartDisplay className="text-[#388d31] h-[27px] w-[27px]"/> 
                <p className="font-semibold text-gray-500 text-[18px]">Video</p>
              </div>

              <div className="flex justify-center items-center cursor-pointer gap-[10px]">
                <HiMiniPhoto className="text-[#094b9f] h-[27px] w-[27px]"/>
                <p className="font-semibold text-gray-500 text-[18px]">Photo</p>
              </div>

              <div className="flex justify-center items-center cursor-pointer gap-[10px]">
                <RiArticleFill className="text-[#b56d0b] h-[27px] w-[27px]"/>
                <p className="font-semibold text-gray-500 text-[18px]">Article</p>
              </div>
            </div>
            
          </div>

          {postData.map((post, index)=>(
            <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt}/>
          ))}

        </div>

        {/* Suggested Users Section */}
        <div className='min-h-[200px] w-full lg:w-[25%] bg-white shadow-lg hidden lg:flex flex-col gap-[20px] p-[10px] rounded-lg'>
          {suggestedUsers.length>0 && <div className='flex flex-col gap-[10px]'>
            <p className="text-gray-500 font-semibold">Suggested Users</p>
            {suggestedUsers.map((user, index)=>(
              <div className='flex flex-col gap-[10px] p-[5px]' key={index}>
                <div className='flex items-center gap-[10px] p-[10px] hover:bg-gray-200 cursor-pointer overflow-hidden rounded-lg' key={user._id} onClick={()=>handleGetProfile(user.userName)}>
                  <div className='flex min-w-[40px] flex-col justify-center items-center text-gray-600'>
                      <img src={user.profileImage || BlankProfile} alt="Profile" className='w-[40px] h-[40px] rounded-full overflow-hidden'/>
                  </div>
                  <div>
                      <div className="font-semibold text-gray-700 text-[17px]">
                          {`${user.firstName} ${user.lastName}`}
                      </div>
                      <div className='text-[14px] text-gray-500 font-semibold max-h-[40px] overflow-hidden'>{user.headline}</div>
                  </div>
                </div>

              </div>
            ))}
          </div>}
          {suggestedUsers.length==0 && <div>
            <p className="text-gray-500 text-center font-semibold">No suggested users available.</p>
          </div>}
        </div>
    </div>
  )
}

export default Home
