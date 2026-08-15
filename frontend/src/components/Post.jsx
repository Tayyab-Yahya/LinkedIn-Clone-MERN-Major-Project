import React, { useContext, useState, useEffect } from 'react'
import BlankProfile from "../assets/BlankProfile.png"
import moment from "moment"
import {BiLike} from "react-icons/bi"
import { userDataContext } from '../context/UserContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { io } from 'socket.io-client'

import { AiOutlineLike } from "react-icons/ai"; //NoFill
import { AiFillLike } from "react-icons/ai"; //Fill
import { FaRegCommentDots } from "react-icons/fa6"; //Comment
import { BiRepost } from "react-icons/bi"; //Repost
import { IoIosSend } from "react-icons/io"; //Share
import { LuSendHorizontal } from "react-icons/lu"
import ConnectionButton from './ConnectionButton'

let socket = io("http://localhost:8000")

function Post({id, author, like, comment, description, image, createdAt}) {

    let [more, setMore] = useState(false)
    let [likes, setLikes] = useState(like || [])
    let [commentContent, setCommentContent] = useState("")
    let [comments, setComments] = useState(comment || [])
    let [showComment, setShowComment] = useState(false)

    let {userData, setUserData, getPost, handleGetProfile} = useContext(userDataContext)
    let {serverUrl} = useContext(authDataContext)

    const handleLike = async () => {
        try {
            let result = await axios.get(serverUrl+`/api/post/like/${id}`, {withCredentials: true})
            setLikes(result.data.like)

        } catch (error) {
            console.log(error)
        }
    }

    const handleComment = async (e) => {
        e.preventDefault()
        if (!commentContent.trim()) return // Don't submit empty comments
        try {
            let result = await axios.post(
                serverUrl+`/api/post/comment/${id}`,
                {content: commentContent},
                {withCredentials: true})
            setComments(result.data.comment)
            setCommentContent("")
            console.log(result.data.comment)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        
        socket.on("likeUpdated", (data) => {
            if (data.postId === id) {
                setLikes(data.likes);
            }
        });
        socket.on("commentAdded", (data) => {
            if (data.postId === id) {
                setComments(data.comm);
            }
        });
        return () => {
            socket.off("likeUpdated");
            socket.off("commentAdded");
        }

    }, [id]);

    useEffect(() => {
        getPost();
    }, [likes, setLikes, comments])

  return (
    <div className="w-full min-h-[200px] bg-white shadow-lg gap-[10px] rounded-lg p-[20px] flex flex-col">
      {/* Upper div */}
      <div className='flex justify-between items-center'>
        {/* Profile Div */}
        <div className='flex justify-center items-start gap-[10px]' onClick={()=>handleGetProfile(author.userName)}>
            <div className='cursor-pointer w-[50px] h-[50px] items-center justify-center rounded-full border-2 border-white'>
                <img src={author.profileImage || BlankProfile} alt="Profile" className='w-full h-full rounded-full overflow-hidden'/>              
            </div>
            <div>
                <div className="font-semibold text-gray-800 text-[20px]">{`${author.firstName} ${author.lastName}`}</div>
                <div className="font-medium text-gray-700 text-[15px]">{author.headline}</div>
                <div className="font-normal text-gray-700 text-[13px]">{moment(createdAt).fromNow()}</div>

            </div>
        </div>

        {/* Button Div */}
        <div>
            {userData._id != author._id && <ConnectionButton userId={author._id} />}
        </div>
      </div>

      {/* Lower Div */}
      <div className={`w-full ${!more? "max-h-[100px] overflow-hidden" : ""} px-[10px]`}>{description}</div>
      <div className='text-[15px] font-semibold pl-[10px] text-gray-800 cursor-pointer mt-[-13px]' onClick={()=>setMore(prev=>!prev)}>{!more? "Read more...":"Read less"}</div>
        {image && <div className='w-full h-[300px] overflow-hidden flex justify-center rounded-lg'>
            <img src={image} alt="" className='h-full rounded-lg' />
        </div>}

        <div>
            <div className='w-full flex justify-between items-center p-[20px] border-b-2 border-gray-400'>
                <div className='flex items-center justify-center gap-[5px] text-[18px]'>
                    <BiLike className='text-blue-500 w-[20px] h-[20px]'/>
                    <span>{likes.length}</span>
                </div>
                <div className='flex items-center justify-center gap-[5px] text-[15px] cursor-pointer' onClick={()=>{setShowComment(prev=>!prev)}}>
                    <span>{comment.length}</span>
                    <span>Comments</span>
                </div>
            </div>
            <div className='flex justify-start items-center gap-[20px] p-[20px] w-full'>
                <div className='flex justify-center items-center gap-[5px] cursor-pointer' onClick={handleLike}>

                    {!likes.includes(userData._id)?
                    <div className='flex justify-center items-center gap-[5px]'> 
                        <AiOutlineLike className='h-[24px] w-[24px]'/>
                        <span>Like</span>
                    </div>
                    : 
                    <div className='flex justify-center items-center gap-[5px]'>
                        <AiFillLike className='h-[24px] w-[24px] text-blue-500'/>
                        <span className='text-blue-500'>Liked</span>
                    </div>
                    }
                </div>
                <div className='flex justify-center items-center gap-[5px] cursor-pointer' onClick={()=>{setShowComment(prev=>!prev)}}>
                    <FaRegCommentDots className='h-[24px] w-[24px]'/>
                    <span>Comment</span>
                </div>
            </div>
            {showComment && <div>
                <form className='w-full flex justify-between items-center border-b-2 border-b-gray-300 p-[10px]'  onSubmit={handleComment}>
                    <input type="text" placeholder='Leave a comment' className='outline-none border-none' onChange={(e)=>setCommentContent(e.target.value)} value={commentContent}/>
                    <button><LuSendHorizontal className='w-[22px] h-[22px] text-blue-500'/></button>
                </form>
                <div className='flex flex-col gap-[10px]'>
                    {comments.map((com) => (
                        <div key={com._id} className='flex flex-col gap-[5px] border-b-2 border-b-gray-300 p-[20px]'>
                            <div className='flex justify-start items-center w-full gap-[10px]'>
                                <div>
                                    <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer'>
                                        <img src={com.user.profileImage || BlankProfile} className='h-full w-full' />
                                    </div>
                                    <div>

                                    </div>
                                </div>
                                <div className="font-semibold text-gray-800 text-[17px]">{`${com.user.firstName} ${com.user.lastName}`}</div>
                            </div>
                            <div>
                                <div className='pl-[50px]'>{com.content}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>}
        </div>
    </div>
  )
}

export default Post
