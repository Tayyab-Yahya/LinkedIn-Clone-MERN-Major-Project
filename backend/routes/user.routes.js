import express from 'express';
import { getCurrentUser, getProfile, updateProfile, search } from '../controllers/user.controllers.js';
import isAuth from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.get('/currentuser', isAuth, getCurrentUser);
userRouter.get('/profile/:userName', isAuth, getProfile);
userRouter.put('/updateprofile', isAuth, upload.fields([
    {name: "profileImage", maxCount:1},
    {name: "coverImage", maxCount:1}
]), updateProfile);
userRouter.get('/search', isAuth, search);

export default userRouter;