import { Request, Response, NextFunction } from "express";
import { CONST } from "../constants/constant";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

interface JwtPayload {
    _id: string
}

export const admin = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const cookie = req.cookies['jwt'];
        
        const { _id } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JwtPayload;

        if(!_id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }   
        const user = await AppDataSource.getRepository(User).findOne({ where: { id: _id } });
        if(!user?.is_admin) {
            return res.status(401).json({
                message: "Unauthorized Role"    
            });
        }
        return next()

    } catch(err){
        return res.status(401).send({message: "Unauthorized"});
    }
}
