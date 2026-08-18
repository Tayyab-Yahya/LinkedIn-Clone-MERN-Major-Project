import React, { useContext, useEffect, useState } from 'react'
import Nav from "../components/Nav.jsx"
import { authDataContext } from '../context/AuthContext.jsx'
import axios from 'axios'
import BlankProfile from "../assets/BlankProfile.png"
import { RxCross1 } from "react-icons/rx";

function Notification() {

    let {serverUrl} = useContext(authDataContext)
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
        } else {
            return "accepted your connection request."
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
        {notificationData.length>0 && <div className='w-[100%] shadow-lg rounded-lg h-[100vh] overflow-auto flex justify-start flex-col gap-[20px] bg-white max-w-[700px] items-center mt-[10px]'>
            {notificationData.map((notification, index) => (
            <div className='w-full min-h-[100px] flex justify-between items-start border-b-2 border-b-gray-200 hover:bg-slate-200 p-[20px]'>
                <div className=''>
                    <div className='flex justify-center items-center gap-[20px]'>
                        <div className='w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer'>
                            <img src={notification.relatedUser.profileImage || BlankProfile} alt="Profile" className='w-full h-full rounded-full overflow-hidden'/>
                        </div>
                        <div className="font-semibold text-gray-700 text-[19px]">
                            {`${notification.relatedUser.firstName} ${notification.relatedUser.lastName}`} {handleMessage(notification.type)}
                        </div>
                    </div>
                    {notification.relatedPost && <div className='flex items-center gap-[10px] ml-[80px] min-h-[50px] overflow-hidden'>
                        {notification.relatedPost.image && <div className='w-[80px] h-[50px]'>
                            <img src={notification.relatedPost.image} alt="" className='h-full overflow-hidden'/>
                        </div>}
                        <div>{notification.relatedPost.description}</div>
                    </div>}
                </div>
                <div className='flex justify-center items-center rounded-full' onClick={()=>handleDeleteNotification(notification._id)}>
                    <RxCross1 className="h-[20px] w-[20px] text-gray-800 font-bold cursor-pointer hover:bg-slate-200" />
                </div>
            </div>
            ))}
        </div>}
    </div>
  )
}

export default Notification
