import React, {useContext, useEffect} from 'react'
import Nav from '../components/Nav'
import {authDataContext} from '../context/AuthContext.jsx'
import axios from 'axios'
import BlankProfile from "../assets/BlankProfile.png"
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";

function Network() {

  let {serverUrl} = useContext(authDataContext)
  let [connections, setConnections] = React.useState([])

  const handleGetRequsts = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection/requests`, { withCredentials: true })
      setConnections(result.data)
    } catch (e) {
      console.error("Error fetching connection requests:", e)
    }
  }

  const handleAcceptConnection = async (requestId) => {
    try {
      let result = await axios.put(`${serverUrl}/api/connection/accept/${requestId}`, {}, { withCredentials: true })
      setConnections(connections.filter(connection => connection._id != requestId))
    } catch(e) {
      console.log(e);
    }
  }

  const handleRejectConnection = async (requestId) => {
    try {
      let result = await axios.put(`${serverUrl}/api/connection/reject/${requestId}`, {}, { withCredentials: true })
      setConnections(connections.filter(connection => connection._id != requestId))
    } catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    handleGetRequsts()
  }, [])

  return (
    <div className="w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col gap-[10px] items-center">
        <Nav />
        <div className="w-full h-[100px] bg-[white] shadow-lg rounded-lg flex items-center text-[20px] font-semibold p-[10px] text-gray-600">
          Invitations: {connections.length}
        </div>

        {connections.length>0 && <div className='w-[100%] shadow-lg rounded-lg min-h-[100px] flex justify-center flex-col gap-[20px] bg-white max-w-[700px] items-center'>
          {connections.map((connection, index) => (
            <div className='w-full min-h-[100px] flex justify-between items-center '>
              {/* Left div */}
              <div className='flex justify-center items-center gap-[20px] pl-[15px]'>
                <div className='w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer'>
                    <img src={connection.sender.profileImage || BlankProfile} alt="Profile" className='w-full h-full rounded-full overflow-hidden'/>
                </div>
                <div className="font-semibold text-gray-700 text-[19px]">
                    {`${connection.sender.firstName} ${connection.sender.lastName}`}
                </div>
              </div>
              {/* Right div */}
              <div className='flex pr-[15px] gap-[5px]'>
                <div className='w-[40px] h-[40px] flex items-center rounded-full justify-center hover:shadow-lg'>
                  <IoIosCheckmarkCircleOutline className='text-blue-500 text-[40px] cursor-pointer' onClick={() => handleAcceptConnection(connection._id)} />
                </div>
                <div className='w-[40px] h-[40px] flex items-center rounded-full justify-center hover:shadow-lg'>
                  <RxCrossCircled className='text-red-500 text-[38px] cursor-pointer' onClick={() => handleRejectConnection(connection._id)} />
                </div>
              </div>
            </div>
          ))}
        </div>}
    </div>
  )
}

export default Network
