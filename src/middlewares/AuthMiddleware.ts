import { Request, Response, NextFunction } from "express";
import { CONST } from "../constants/constant";
import jwt from "jsonwebtoken";

interface JwtPayload {
    _id: string
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const cookie = req.cookies['jwt'];
        const { _id } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JwtPayload;

        if(!_id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }   

        return next()

    } catch(err){
        return res.status(401).send({message: "Unauthorized"});
    }
}
