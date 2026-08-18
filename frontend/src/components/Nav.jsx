import React, {useState, useContext, useEffect} from 'react'
import logo2 from "../assets/logo2.png"
import { IoSearchSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotificationsSharp } from "react-icons/io5";
import BlankProfile from "../assets/BlankProfile.png"
import { userDataContext } from '../context/UserContext.jsx';
import { authDataContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Nav() {

    let [activeSearch, setActiveSearch] = useState(false)
    let [showPopup, setShowPopup] = useState(false)
    let [searchInput, setSearchInput] = useState("")
    let [searchData, setSearchData] = useState([])

    let {userData, setUserData, handleGetProfile} = useContext(userDataContext)
    let {serverUrl} = useContext(authDataContext)
    let navigate = useNavigate()

    const handleSignOut = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/auth/logout`, {withCredentials: true})
            setUserData(null)
            navigate('/login')
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`, {withCredentials: true})
            setSearchData(result.data)

        } catch (error) {
            setSearchData([])
        }
    }

    useEffect(()=>{
            handleSearch()        
    }, [searchInput])

  return (
    <div className="w-full h-[80px] bg-white fixed top-0 shadow-lg flex sm:justify-between justify-between items-center px-[10px] z-[80]">
        <div className="flex justify-center items-center gap-[10px] ml-[40px] z-[80]">
            <div onClick={() => {setActiveSearch(false); navigate('/')}} className='cursor-pointer'>
                <img src={logo2} alt="Logo" className='w-[50px]'/>
            </div>

            {!activeSearch && <div><IoSearchSharp className='w-[23px] h-[23px] text-gray-600 md:hidden' onClick={() => setActiveSearch(true)}/></div>}

            {searchData.length>0 && <div className='absolute shadow-lg top-[100px] left-[0px] lg:left-[20px] w-[100%] md:w-[400px] lg:w-[600px] bg-white min-h-[100px] flex flex-col gap-[20px] p-[20px] rounded-lg max-h-[400px] overflow-auto'>
                {searchData.map((data)=>(
                    <div className='flex items-center gap-[20px] p-[10px] border-b-2 border-b-gray-300 hover:bg-gray-200 cursor-pointer rounded-lg' key={data._id} onClick={()=>handleGetProfile(data.userName)}>
                        <div className='flex flex-col justify-center items-center text-gray-600'>
                            <img src={data.profileImage || BlankProfile} alt="Profile" className='w-[60px] h-[60px] rounded-full overflow-hidden'/>
                        </div>
                        <div>
                            <div className="font-semibold text-gray-700 text-[19px]">
                                {`${data.firstName} ${data.lastName}`}
                            </div>
                            <div className='text-[15px] text-gray-500 font-semibold'>{data.headline}</div>
                        </div>
                    </div>
                ))}
            </div>}

            <form className={`w-[200px] lg:w-[350px] h-[40px] bg-[#f0efe7] items-center gap-[10px] px-[10px] py-[5px] rounded-full border-gray-500 border md:flex ${!activeSearch? "hidden": "flex"} `}>

                <div><IoSearchSharp className='w-[23px] h-[23px] text-gray-600'/></div>
                <input type="text" placeholder='Search' value={searchInput} className='bg-transparent outline-none w-[80%] border-0' onChange={(e)=>setSearchInput(e.target.value)}/>
            </form>
        </div>
        <div className="flex justify-center items-center gap-[20px] mr-[40px]">

            {showPopup &&
                <div className='w-[300px] min-h-[300px] bg-white shadow-lg absolute md:right-[80px] right-[25px] top-[85px] rounded-lg flex flex-col items-center gap-[20px] p-[20px]'>

                <div className='flex flex-col justify-center items-center text-gray-600 cursor-pointer'>
                    <img src={userData.profileImage || BlankProfile} alt="Profile" className='w-[60px] h-[60px] rounded-full overflow-hidden' onClick={()=>handleGetProfile(userData.userName)}/>
                </div>
                <div className="font-semibold text-gray-700 text-[19px] cursor-pointer" onClick={()=>handleGetProfile(userData.userName)}>
                    {`${userData.firstName} ${userData.lastName}`}
                </div>
                <button className='w-[100%] h-[40px] bg-white hover:text-white text-blue-800 py-[5px] px-[10px] rounded-full hover:bg-blue-600 border-2 border-blue-500' onClick={()=>navigate('/profile')}>View Profile</button>
                <div className="h-[2px] w-full bg-gray-300"></div>
                <div className='flex justify-start items-center text-gray-600 cursor-pointer w-full gap-[15px]' onClick={()=> navigate('/network')}>
                    <FaUserGroup className='w-[24px] h-[24px] text-gray-600'/>
                    <div>My Network</div>
                </div>
                <button className='w-[100%] h-[40px] bg-white hover:text-white text-red-800 py-[5px] px-[10px] rounded-full hover:bg-red-600 border-2 border-red-500' onClick={handleSignOut}>
                    Sign Out
                </button>

            </div> }

            <div className='lg:flex flex-col justify-center items-center text-gray-600 cursor-pointer hidden'>
                <TiHome className='w-[24px] h-[24px] text-gray-600'/>
                <div>Home</div>
            </div>
            <div className='lg:flex flex-col justify-center items-center text-gray-600 cursor-pointer hidden' onClick={()=> navigate('/network')}>
                <FaUserGroup className='w-[24px] h-[24px] text-gray-600'/>
                <div>My Network</div>
            </div>
            <div className='flex flex-col justify-center items-center text-gray-600 cursor-pointer' onClick={()=>navigate("/notification")}>
                <IoNotificationsSharp className='w-[24px] h-[24px] text-gray-600'/>
                <div className='md:block hidden'>Notifications</div>
            </div>
            <div className='flex flex-col justify-center items-center text-gray-600 cursor-pointer' onClick={() => setShowPopup(prev=> !prev)}>
                <img src={userData.profileImage || BlankProfile} alt="Profile" className='w-[40px] h-[40px] rounded-full overflow-hidden'/>
            </div>
        </div>
    </div>
  )
}

export default Nav
