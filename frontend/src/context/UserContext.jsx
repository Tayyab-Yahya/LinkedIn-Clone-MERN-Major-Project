import React, {createContext, useContext, useState, useEffect} from 'react'
export const userDataContext = createContext();
import {authDataContext} from './AuthContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {io} from "socket.io-client"

export let socket = io("http://localhost:8000")

function UserContext({children}) {

    let [userData, setUserData] = useState(null);
    let {serverUrl} = useContext(authDataContext);
    let [edit, setEdit] = useState(false);
    let [postData, setPostData] = useState([]);
    let [profileData, setProfileData] = useState([]);

    const navigate = useNavigate();

    const getCurrentUser = async () => {
        try {
            let result = await axios.get(serverUrl+'/api/user/currentuser', {withCredentials: true});
            setUserData(result.data);
            // console.log(result.data);
        } catch (error) {
            console.log(error);
            setUserData(null);
        }
    }

    const getPost = async () => {
        try {
            let result = await axios.get(serverUrl+"/api/post/getpost", {withCredentials: true})
            setPostData(result.data)
            
        } catch (error) {
            console.log(error)
        }
    }

    const handleGetProfile = async (userName) => {
        try {
            let result = await axios.get(serverUrl+`/api/user/profile/${userName}`, {withCredentials: true});
            setProfileData(result.data)            

            navigate(`/profile`);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCurrentUser();
        getPost();
    }, []);

    const value = {userData, setUserData, edit, setEdit, postData, setPostData, getPost, profileData, setProfileData, handleGetProfile};

  return (
    <div>
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    </div>
  )
}

export default UserContext
