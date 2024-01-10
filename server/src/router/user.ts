import jwt from "jsonwebtoken";
import express from 'express';
import { authenticateJwtUser ,USERSECRET} from "../middleware";
import { User} from "../db";
import { Request, Response } from "express";
const userRouter = express.Router();

userRouter.post('/signup', async (req : Request, res : Response) => {
    try{
        const {email, password, username, profilePicture} = req.body;
        const user = await User.findOne({email});

        if(user){
            res.status(403).json({message : "User already exists"});
        }else{
            const newUser = new User({email, password, username, wishlist : [], profilePicture, myGames : []});
            await newUser.save();
            const token = jwt.sign({id : newUser._id}, USERSECRET, {expiresIn : '1h'});
            res.json({message : "User Signed up successfully", token});
        }
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

userRouter.post('/signin', async(req : Request, res : Response) => {
    try{
    const {email, password} = req.body;
    const user = await User.findOne({email, password});
    if(user){
        const token = jwt.sign({id : user._id}, USERSECRET, {expiresIn : '1h'});
        res.json({message : "User Logged in successfully", token});
    } else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export {userRouter};
