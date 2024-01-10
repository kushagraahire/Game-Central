import jwt from "jsonwebtoken";
import express from 'express';
import { authenticatedPublisherRequest, authenticateJwtPublisher , PUBLISHERSECRET} from "../middleware";
import { Publisher} from "../db";
import { Request, Response } from "express";
import mongoose from "mongoose";
const publisherRouter = express.Router();

// Publisher Signup
publisherRouter.post('/signup', async (req : Request, res : Response) => {
    try{
        const {publisherEmail, publisherPassword, publisherUsername, publisherProfilePicture} = req.body;
        const publisher = await Publisher.findOne({publisherEmail});

        if(publisher){
            res.status(403).json({message : "Publisher already exists"});
        }else{
            const newPublisher = new Publisher({publisherEmail, publisherPassword, publisherUsername, publisherDescription : "", publisherProfilePicture, publishedGames : []});
            await newPublisher.save();
            const token = jwt.sign({id : newPublisher._id}, PUBLISHERSECRET, {expiresIn : '1h'});
            res.json({message : "Publisher Signed up successfully", token});
        }
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Publisher Signin
publisherRouter.post('/signin', async(req : Request, res : Response) => {
    try{
    const {publisherEmail, publisherPassword} = req.body;
    const publisher = await Publisher.findOne({publisherEmail, publisherPassword});
    if(publisher){
        const token = jwt.sign({id : publisher._id}, PUBLISHERSECRET, {expiresIn : '1h'});
        res.json({message : "Publisher Logged in successfully", token});
    } else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add a game
interface gameRequestBody{
    title : String,
    genre : String,
    gameDescription : String,
    price : Number,
    releaseDate : String,
    recSystemRequirements : {},
    minSystemRequirements : {},
    downloadLink : String,
    publisher : {type : mongoose.Schema.Types.ObjectId, ref : "Publisher"},
    languageSupport : [String],
    ageRating : String
}

publisherRouter.post('/addGame', authenticateJwtPublisher, async(req : authenticatedPublisherRequest, res : Response) => {
    const game : gameRequestBody = req.body;
    game.publisher = req.publisher;
})

export {publisherRouter};