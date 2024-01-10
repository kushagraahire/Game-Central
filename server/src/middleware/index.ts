import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
const USERSECRET = "G4M3C3NTR4LUS3R"
const PUBLISHERSECRET = "G4M3C3NTR4LPUBL1SH3R"

interface authenticatedUserRequest extends Request{
    user? : any;
}

interface authenticatedPublisherRequest extends Request{
    publisher? : any;
}

const authenticateJwtUser = (req : authenticatedUserRequest, res : Response, next : NextFunction)=>{
    const authHeader = req.headers.authorization;

    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, USERSECRET, (err , user) => {
            if(err){
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }else{
        res.sendStatus(401);
    }
}

const authenticateJwtPublisher = (req : authenticatedPublisherRequest, res : Response, next : NextFunction)=>{
    const authHeader = req.headers.authorization;

    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, PUBLISHERSECRET, (err, publisher)=>{
            if(err){
                return res.sendStatus(403);
            }
            req.publisher = publisher;
            next();
        });
    }else{
        res.sendStatus(401);
    }
}

export {authenticateJwtUser, USERSECRET, authenticateJwtPublisher, PUBLISHERSECRET, authenticatedPublisherRequest}