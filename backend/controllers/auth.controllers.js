import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";

export const signUp = async (req, res) => {
    try {

        // fetching data from request body
        let {firstName, lastName, userName, email, password} = req.body;

        // checking if email or username already exists in database
        let emailExists = await User.findOne({email});
        if(emailExists){
            return res.status(400).json({message: "Email already exists!"});
        }
        let userNameExists = await User.findOne({userName});
        if(userNameExists){
            return res.status(400).json({message: "Username already exists!"});
        }
        if(password.length < 8) {
            return res.status(400).json({message: "Password must be at least 8 characters long!"});
        }

        // hashing password
        let hashedPassword = await bcrypt.hash(password, 10);

        // creating new user in database
        let newUser = await User.create({
            firstName, 
            lastName, 
            userName, 
            email, 
            password: hashedPassword,
        });
        
        // generating token and sending response
        let token = await genToken(newUser._id);

        // setting token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 Days
            sameSite: "strict",
            secure: process.env.NODE_ENVIRONMENT === "production",
        });

        return res.status(201).json(newUser);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "signup error"});
    };
};

export const login = async (req, res) => {
    try {
        // fetching data from request body
        let {email, password} = req.body;

        // checking if email or username already exists in database
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Email does not exists!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Incorrect password!"});
        }

        // generating token and sending response
        let token = await genToken(user._id);

        // setting token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 Days
            sameSite: "strict",
            secure: process.env.NODE_ENVIRONMENT === "production",
        });

        return res.status(201).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "login error"});
    };
};

export const logOut = async (req, res) => {
    
    try{
        res.clearCookie("token");
        return res.status(200).json({message: "Logged out successfully."})
    } catch (error) {
        
        console.log(error);
        return res.status(500).json({message: "logout error"});
    }
};