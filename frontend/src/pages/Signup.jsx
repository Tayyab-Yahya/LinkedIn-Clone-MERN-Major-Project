import React from 'react'
import {useState, useContext} from 'react'
import logo from "../assets/logo.svg"
import {useNavigate} from "react-router-dom";
import {authDataContext} from "../context/AuthContext.jsx";
import {userDataContext} from "../context/UserContext.jsx";
import axios from 'axios';

function Signup() {

  let [show, setShow] = useState(false);
  let [loading, setLoading] = useState(false);
  let [err, setErr] = useState("");

  let navigate = useNavigate();
  let {serverUrl} = useContext(authDataContext);
  let {userData, setUserData} = useContext(userDataContext);

  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(serverUrl+'/api/auth/signup', {
        firstName, lastName, userName, email, password
      }, {withCredentials: true});
      console.log(result);
      setUserData(result.data);
      navigate("/");
      setLoading(false);
      setErr("");

      setFirstName("");
      setLastName("");
      setUserName("");
      setEmail("");
      setPassword("");
    } catch(error) {
      setErr(error.response.data.message);
      setLoading(false); 
    }
  }

  return (
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start gap-[10px]'>
      <div className='flex w-full h-[2rem] m-5 items-center'>
        <img src={logo} alt='LinkedIn Logo' className='h-[95%] ml-5 w-auto'></img>
      </div>
      <form className='w-[90%] max-w-[400px] h-[85%] md:shadow-xl flex flex-col justify-center gap-[10px] md:border-[1px] md:border-gray-300 rounded-lg p-5 pl-[15px]' onSubmit={handleSignup}>
            <h1 className='text-gray-800 text-[20px] sm:text-[25px] font-semibold mb-[10px]'>Join LinkedIn now — it’s free!</h1>
            
            <input type='text' placeholder='First Name' required className='w-[100%] h-[40px] border-[2px] border-gray-300 text-gray-800 text-[15px] px-[15px] py-[7px] rounded-lg' value={firstName} onChange={(e) => setFirstName(e.target.value)}></input>
            
            <input type='text' placeholder='Last Name' required className='w-[100%] h-[40px] border-[2px] border-gray-300 text-gray-800 text-[15px] px-[15px] py-[7px] rounded-lg' value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
            
            <input type='text' placeholder='Username' required className='w-[100%] h-[40px] border-[2px] border-gray-300 text-gray-800 text-[15px] px-[15px] py-[7px] rounded-lg' value={userName} onChange={(e) => setUserName(e.target.value)}></input>
            
            <input type='email' placeholder='Email' required className='w-[100%] h-[40px] border-[2px] border-gray-300 text-gray-800 text-[15px] px-[15px] py-[7px] rounded-lg' value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <div className='w-[100%] h-[40px] border-[2px] text-gray-800 text-[15px] border-gray-300 rounded-lg relative'>
              
              <input type={show? "text":"password"} placeholder='Password' required className='text-gray-800 text-[15px] w-full h-full px-[15px] py-[7px] border-none rounded-lg' value={password} onChange={(e) => setPassword(e.target.value)}></input>
              <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-700 cursor-pointer font-semibold' onClick={() => setShow(!show)}>{show?"Hide":"Show"}</span>
            </div>
            <p className='text-gray-500 text-[10px] mt-3 text-center'>
              By clicking Agree & Join or Continue, you agree to the LinkedIn <span className='text-blue-700 hover:underline cursor-pointer'>User Agreement, </span> <span className='text-blue-700 hover:underline cursor-pointer'>Privacy Policy, </span> and <span className='text-blue-700 hover:underline cursor-pointer'> Cookie Policy. </span>
            </p>

            {err && <p className='text-red-500 text-[12px] text-center'>*{err}</p>}

            <button type='submit' className='w-[100%] h-[40px] bg-blue-700 text-white text-[15px] font-semibold rounded-full hover:bg-blue-900' disabled={loading}>
              {loading?"Loading...":"Agree & Join"}
            </button>
            <p className='text-center text-[12px]'>Already have an account? <span onClick={()=>navigate("/login")} className='text-blue-700 hover:underline cursor-pointer'>Sign in</span></p>
      </form>
    </div>
  )
};

export default Signup