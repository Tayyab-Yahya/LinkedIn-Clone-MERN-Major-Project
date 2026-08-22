import User from '../models/user.model.js';
import uploadOnCloudinary from "../config/cloudinary.js"
import Notification from '../models/notification.model.js';

export const getCurrentUser = async (req, res) => {
    try {
        let id = req.userId;
        
        let user = await User.findById(id).select("-password");
        
        if(!user){
            return res.status(401).json({message: "User not found."});
        }
        return res.status(200).json(user);
    } catch (error) {
    
        console.log(error);
        return res.status(500).json({message: "getCurrentUser error."});
    }
}

export const updateProfile = async (req, res) => {
    try {
        let {firstName, lastName, userName, headline, location, gender} = req.body;
        let skills = req.body.skills? JSON.parse(req.body.skills): [];
        let education = req.body.education? JSON.parse(req.body.education): [];
        let experience = req.body.experience? JSON.parse(req.body.experience): [];
        let profileImage, coverImage;
        console.log(req.files);
        if(req.files.profileImage){
            profileImage = await uploadOnCloudinary(req.files.profileImage[0].path);
        }
        if(req.files.coverImage){
            coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
        }
        let user = await User.findByIdAndUpdate(req.userId,{
            firstName, lastName, userName, headline, location, gender, skills, education, experience, profileImage, coverImage
        },{new:true}).select("-password");
        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "updateProfile route error"});
    }
}

export const getProfile = async (req, res) => {
    try {
        let {userName} = req.params

        let user = await User.findOne({userName}).select("-password");
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        
        if(user._id != req.userId){
            let notification = await Notification.create({
                receiver: user,
                type: "profileViewed",
                relatedUser: req.userId,
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "getProfile route error"});
    }
}

export const search = async (req, res) => {
    try {
        let {query} = req.query;
        if(!query){
            return res.status(400).json({message: "Query is required!"});
        }
        let users = await User.find({
            $or:[
                {firstName: {$regex:query, $options:'i'}},
                {lastName: {$regex:query, $options:'i'}},
                {userName: {$regex:query, $options:'i'}},
                {skills: {$in:[query]}}
            ]
        })
        return res.status(200).json(users)
    } catch(e) {
        console.log(e);
        return res.status(400).json({message: "Search error"})
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        let currentUser = await User.findById(req.userId).select("connection");
        let suggestedUsers = await User.find({
            _id:{
                $ne: currentUser, $nin:currentUser.connection
            }
        }).select("-password");
        return res.status(200).json(suggestedUsers);
    } catch(e) {
        console.log(e);
        return res.status(500).json({message: "getSuggestedUsers error"});
    }
}