import jwt from "jsonwebtoken";
import express from 'express';
import { Game } from "../db";
import { Request, Response } from "express";
import mongoose from "mongoose";
const gameRouter = express.Router()

// get all games
gameRouter.get('/', async(req : Request, res : Response) =>{
    try{
        const games = await Game.find({});
        if(games){
            res.json({games});
        }else{
            res.status(404).json({message : "Games not found"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// get a specific game
gameRouter.get('/:gameId', async (req: Request, res : Response) => {
    try{
        const game = await Game.findById(req.params.gameId);
        if(game){
            res.json({game});
        }else{
            res.status(404).json({message : "Game not found"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

export {gameRouter};