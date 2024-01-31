import jwt from "jsonwebtoken";
import express from 'express';
import { authenticatedPublisherRequest, authenticateJwtPublisher , PUBLISHERSECRET} from "../middleware";
import { Game, Publisher} from "../db";
import { Request, Response } from "express";
import mongoose from "mongoose";
const publisherRouter = express.Router();

// Publisher Signup
publisherRouter.post('/signup', async (req : Request, res : Response) => {
    try{
        const {publisherEmail, publisherPassword, publisherUsername} = req.body;
        const publisher = await Publisher.findOne({publisherEmail});

        if(publisher){
            res.status(403).json({message : "Publisher already exists"});
        }else{
            const publishedGames = [{type : mongoose.Schema.Types.ObjectId, ref : "Game"}]
            const newPublisher = new Publisher({publisherEmail, publisherPassword, publisherUsername, publisherDescription : "", publisherProfilePicture : "", publishedGames : []});
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

// add a game
interface gameRequestBody{
    title : String,
    genre : String,
    gameDescription : String,
    price : Number,
    releaseDate : String,
    recSystemRequirements : {},
    minSystemRequirements : {},
    downloadLink : String,
    languageSupport : [String],
    ageRating : String,
    coverPhoto : String,
    snapshots : [String]
}

publisherRouter.post('/addGame', authenticateJwtPublisher, async(req : authenticatedPublisherRequest, res : Response) => {
    try{
        const body : gameRequestBody = req.body;
        const newGame = new Game({...body, publisher : req.publisher.id});
        await newGame.save();
        const publisher = await Publisher.findById(req.publisher.id);
        if(publisher){
            publisher.publishedGames.push(newGame._id);
            await publisher.save();
            res.json({message : "Game published successfully", gameId : newGame._id});
        }else{
            res.status(404).json({messaage : "Publisher Not Found"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// update game
publisherRouter.put('/updateGame/:gameId', authenticateJwtPublisher, async(req : authenticatedPublisherRequest, res : Response) => {
    try{
        const game = await Game.findByIdAndUpdate(req.params.gameId, {...req.body, publisher : req.publisher.id}, {new : true});
        if (game) {
            res.json({ message: 'Game updated successfully' });
        } else {
            res.status(404).json({ message: 'Game Not Found' });
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// delete game
publisherRouter.delete('/deleteGame/:gameId', authenticateJwtPublisher, async(req : authenticatedPublisherRequest, res : Response) => {
    try{
        const deleteGame = await Game.findByIdAndDelete(req.params.gameId);
        if(deleteGame){
            const publisher = await Publisher.findByIdAndUpdate(req.publisher.id, { $pull: { publishedGames: req.params.gameId } },
                { new: true })
            if(publisher){
                res.json({messaage : "Game deleted successfully"});
            }else{
                res.status(404).json({messaage : "Publisher Not Found"});
            }
        }else{
            res.status(404).json({message : "Game Not Found"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// get published games
publisherRouter.get('/publishedGames', authenticateJwtPublisher, async (req : authenticatedPublisherRequest, res : Response) => {
    try{
        const publisher = await Publisher.findById(req.publisher.id).populate('publishedGames');
        if(publisher){
            res.json({publishedGames : publisher.publishedGames || []})
        }else{
            res.status(404).json({messaage : "Publisher Not Found"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// get publsiher profile
publisherRouter.get('/profile', authenticateJwtPublisher, async (req : authenticatedPublisherRequest, res : Response) => {
    try{
        const publisher = await Publisher.findById(req.publisher.id);
        if(publisher){
            res.json({publisher});
        }else{
            res.status(404).json({messaage : "Publisher Not Found"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// update publisher profile
publisherRouter.put('/updateProfile', authenticateJwtPublisher, async(req : authenticatedPublisherRequest, res : Response) => {
    try{
        const publisher = await Publisher.findByIdAndUpdate(req.publisher.id, req.body, {new : true});
        if(publisher){
            res.json({message : "Publisher Profile Updated Successfully"});
        }else{
            res.status(404).json({ message: 'Publisher Not Found' });
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

export {publisherRouter};