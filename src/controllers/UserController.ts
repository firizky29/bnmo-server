// import { getRepository } from "typeorm"
import { NextFunction, Request, Response } from "express"
import { User } from "../models/User"
import { AppDataSource } from "../data-source"

class UserController{
    private userRepository;

    constructor(){
        this.userRepository = AppDataSource.getRepository(User)
    }

    getUser = async(req: Request, res: Response, next: NextFunction) => {
        try{
            const users = await this.userRepository.find({ where: { is_admin: false, verification_status: req.params.verification_status } })
            return res.status(200).json(users)
        } catch(err){
            return res.status(500).send({message: "Internal Server Error"})
        }
    }

    updateUser = async(req: Request, res: Response, next: NextFunction) => {
        try{
            const user = await this.userRepository.findOne({ where: { username: req.params.username } })
            if(!user){
                return res.status(404).send({message: "User not found"})
            }
            user.verification_status = req.body.verification_status
            await this.userRepository.save(user)
            return res.status(200).send({message: "User updated"})
        } catch(err){
            return res.status(500).send({message: "Internal Server Error"})
        }
    }

}

export default new UserController()

