// import { getRepository } from "typeorm"
import { NextFunction, Request, Response } from "express"
import { Like } from "typeorm";
import BaseController from "./BaseController";


class UserController extends BaseController {

    getAllUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let filter = {}
            filter= {where: {is_admin: false}}
            if (req.query.search) {
                filter = { 
                    where: [
                        { is_admin: false, username: Like(`%${req.query.search}%`) }, 
                        { is_admin: false, name: Like(`%${req.query.search}%`) }
                    ]
                }
            }
            const page = parseInt(req.query.page as any) || 1;
            const limit = parseInt(req.query.limit as any) || 10;
            const offset = (page - 1) * limit;
            const total = await this.userRepository.count(filter);
            const users = await this.userRepository.find({
                ...filter,
                skip: offset,
                take: limit
            });

            return res.status(200).json(
                {
                    total: total,
                    page: page,
                    data: users,
                    limit: limit,
                    last_page: Math.ceil(total / limit)
                }
            )
        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }

    getUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let filter = {}
            filter = { is_admin: false, verification_status: req.params.verification_status }
            if (req.query.search) {
                filter = { 
                    where: [
                        { 
                            verification_status: req.params.verification_status, 
                            is_admin: false, 
                            username: Like(`%${req.query.search}%`) }, 
                        { 
                            verification_status: req.params.verification_status, 
                            is_admin: false, 
                            name: Like(`%${req.query.search}%`) }
                    ]
                }
            }
            const page = parseInt(req.query.page as any) || 1;
            const limit = parseInt(req.query.limit as any) || 10;
            const offset = (page - 1) * limit;
            const total = await this.userRepository.count({ where: { ...filter } });
            const users = await this.userRepository.find({
                where: { ...filter },
                skip: offset,
                take: limit
            });

            return res.status(200).json(
                {
                    total: total,
                    page: page,
                    data: users,
                    limit: limit,
                    last_page: Math.ceil(total / limit)
                }
            )
        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userRepository.findOne({ where: { id: req.params.id } })
            if (!user) {
                return res.status(404).send({ message: "User not found" })
            }
            user.verification_status = req.body.verification_status
            await this.userRepository.save(user)
            return res.status(200).send({ message: "User updated" })
        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }

}

export default new UserController()

