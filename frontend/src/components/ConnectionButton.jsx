import React, { useContext, useEffect, useState } from 'react'
import {authDataContext} from '../context/AuthContext.jsx'
import {userDataContext} from '../context/UserContext.jsx'
import axios from 'axios'
import io from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
const socket = io("http://localhost:8000")

function ConnectionButton({ userId }) {

    let { serverUrl } = useContext(authDataContext)
    let { userData, setUserData } = useContext(userDataContext)
    const navigate = useNavigate()

    let [status, setStatus] = useState("")

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

    const handleRemoveConnection = async () => {
        try {
            let result = await axios.delete(
                `${serverUrl}/api/connection/remove/${userId}`, 
                { withCredentials: true }
            )
            console.log(result.data)
        } catch (error) {
            console.error("Error removing connection:", error)
        }
    }

    const handleGetStatus = async () => {
        try {
            let result = await axios.get(
                `${serverUrl}/api/connection/getstatus/${userId}`, 
                { withCredentials: true }
            )
            setStatus(result.data.status)
        } catch (error) {
            console.error("Error fetching connection status:", error)
        }
    }

    useEffect(() => {
            socket.emit("register", userData._id)
            handleGetStatus();
            socket.on("statusUpdate", ({updatedUserId, newStatus}) => {
                if(updatedUserId == userId) {
                    setStatus(newStatus)
                }
            })
    }, [userId])

    const handleClick = async () => {

        if(status == "connect"){
            await handleSendConnection()
        } 
        else if (status == "received"){
            navigate('/network')
        } else {
            await handleRemoveConnection()
        }
    }

  return (
    <button className={`${status === "pending" ? "bg-gray-500 cursor-not-allowed border-gray-500" : "bg-blue-500 hover:bg-blue-600"} min-w-[100px] h-[40px] text-white py-[5px] px-[10px] rounded-full border-2 border-blue-500`} onClick={handleClick} disabled={status == "pending"}>
      {status}
    </button>
  )
}

export default ConnectionButton;