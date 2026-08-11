import React, { useContext, useEffect } from 'react'
import {authDataContext} from '../context/AuthContext.jsx'
import {userDataContext} from '../context/UserContext.jsx'
import axios from 'axios'
import io from 'socket.io-client'
const socket = io("http://localhost:8000")

function ConnectionButton({ userId }) {

    let { serverUrl } = useContext(authDataContext)
    let { userData, setUserData } = useContext(userDataContext)

    const handleSendConnection = async () => {
        try {
            let result = await axios.post(
                `${serverUrl}/api/connection/send/${userId}`, 
                {}, 
                { withCredentials: true }
            )
            console.log(result.data)
        } catch (error) {
            console.error("Error sending connection request:", error)
        }
    }

    useEffect(() => {
            socket.emit("register", userData._id)
    }, [userId])

  return (
    <button className='w-[100%] h-[40px] bg-blue-500 text-white py-[5px] px-[10px] rounded-full hover:bg-blue-600 border-2 border-blue-500'>Connect</button>
  )
}

export default ConnectionButton;
