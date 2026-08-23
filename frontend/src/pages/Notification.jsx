import React, { useContext, useEffect, useState } from 'react'
import Nav from "../components/Nav.jsx"
import { authDataContext } from '../context/AuthContext.jsx'
import { userDataContext } from '../context/UserContext.jsx'
import axios from 'axios'
import BlankProfile from "../assets/BlankProfile.png"
import { RxCross1 } from "react-icons/rx";

function Notification() {

    let {serverUrl} = useContext(authDataContext)
    let {handleGetProfile} = useContext(userDataContext)
    let [notificationData, setNotificationData] = useState([])

    const handleGetNotification = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/notification/get`, {withCredentials: true})
            setNotificationData(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteNotification = async (id) => {
        try {
            let result = await axios.delete(`${serverUrl}/api/notification/deleteone/${id}`, {withCredentials: true})
            await handleGetNotification()
        } catch (error) {
            console.log(error)
        }
    }

    const handleClearAllNotifications = async () => {
        try {
            let result = await axios.delete(`${serverUrl}/api/notification`, {withCredentials: true})
            await handleGetNotification()
        } catch (error) {
            console.log(error)
        }
    }

    function handleMessage (type) {
        if(type=='like'){
            return "liked your post."
        } else if(type=='comment'){
            return "commented on your post."
        } else if(type=='connectionAccepted'){
            return "accepted your connection request."
        } else {
            return "viewed your profile."
        }
    }



    useEffect(()=>{
        handleGetNotification()
    }, [])

  return (
    <div className="w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col gap-[10px] items-center">
      <Nav/>      
        <div className="w-full h-[100px] bg-[white] shadow-lg rounded-lg flex justify-between items-center text-[20px] font-semibold p-[20px] text-gray-600">
            <div>Notifications ({notificationData.length})</div>
            {notificationData.length>0 && <button
                className="w-[100px] h-[40px] bg-red-600 text-white py-[5px] px-[10px] rounded-full hover:bg-red-700 border-2 text-[18px] flex justify-center items-center p-[5px]"
                onClick={handleClearAllNotifications} >
                <span>clear all</span>
            </button>}
        </div>

        {notificationData.length>0 && <div className='w-[100%] shadow-lg rounded-lg h-[100vh] overflow-auto flex justify-start flex-col gap-[0px] bg-white max-w-[700px] items-center mt-[10px]'>
            {notificationData.map((notification, index) => (

            <div className='flex gap-[5px] md:gap-0 p-[10px] md:p-[20px] justify-between w-full hover:bg-slate-200  border-b-2 border-b-gray-300'>
                {/* Profile Section */}
                <div className='h-[40px] w-[40px] md:w-[60px] md:h-[60px] rounded-full overflow-hidden cursor-pointer' onClick={()=>handleGetProfile(notification.relatedUser.userName)}>
                    <img src={notification.relatedUser.profileImage || BlankProfile} alt="" className='w-full h-full overflow-hidden rounded-full'/>
                </div>
                {/* Central Data Section */}
                <div className='flex flex-col w-[15rem] md:w-[30rem] gap-[10px] justify-center'>
                    {/* Upper div for username and message */}
                    <div className='text-[15px] md:text-[18px]'>
                        <span className='font-semibold cursor-pointer' onClick={()=>handleGetProfile(notification.relatedUser.userName)}>{`${notification.relatedUser.firstName} ${notification.relatedUser.lastName}`}</span> {handleMessage(notification.type)}
                    </div>
                    {/* Lower div for related post and description */}
                    {notification.relatedPost && <div className={`border-gray-400 border-2 flex rounded-lg overflow-hidden items-center ${notification.relatedPost.image? '':'p-[10px]'}`}>
                        {notification.relatedPost.image && <div className='w-[100px] h-[70px]'>
                            <img src={notification.relatedPost.image} alt="" className='h-full overflow-hidden'/>
                        </div>}
                        {notification.relatedPost.description && <div className='max-h-[65px]'>{notification.relatedPost.description}</div>}
                    </div>}
                </div>
                {/* Rightmost cross button section */}
                <div>
                    <RxCross1 className='h-[20px] w-[20px] text-gray-800 font-bold cursor-pointer hover:bg-slate-200' onClick={()=>handleDeleteNotification(notification._id)} />
                </div>
            </div>
            ))}
        </div>}
    </div>
  )
}

export default Notification
