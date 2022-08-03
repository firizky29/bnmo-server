import { NextFunction, Request, Response } from "express"
import BaseController from "./BaseController";
import { CONST } from "../constants/constant";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import { Not } from "typeorm"

interface JwtPayload {
    _id: string
}

class HistoryController extends BaseController {
    getAllHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cookie = req.cookies['jwt'];
            const { _id } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JwtPayload;
            const filter = {
                relations: ["creditor", "debitor"],
                where: [
                    { creditor: { id: _id } },
                    { debitor: { id: _id } },
                ]
            }

            const page = parseInt(req.query.page as any) || 1;
            const limit = parseInt(req.query.limit as any) || 10;
            const offset = (page - 1) * limit;
            const total = await this.transactionRepository.count(filter);

            const history = await this.transactionRepository.find({
                ...filter,
                skip: offset,
                take: limit,
                order: {
                    created_at: "DESC"
                }
            });

            return res.status(200).json({
                total: total,
                page: page,
                data: history,
                limit: limit,
                last_page: Math.ceil(total / limit)
            })
        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }

    getTransferHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cookie = req.cookies['jwt'];
            const { _id } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JwtPayload;
            const filter = {
                relations: ["creditor", "debitor"],
                where: [
                    { creditor: { id: _id }, debitor: { is_admin: false } },
                    { debitor: { id: _id }, creditor: { is_admin: false } }
                ]
            }

            const page = parseInt(req.query.page as any) || 1;
            const limit = parseInt(req.query.limit as any) || 10;
            const offset = (page - 1) * limit;
            const total = await this.transactionRepository.count(filter);

            const history = await this.transactionRepository.find({
                ...filter,
                skip: offset,
                take: limit,
                order: {
                    created_at: "DESC"
                }
            });

            return res.status(200).json({
                total: total,
                page: page,
                data: history,
                limit: limit,
                last_page: Math.ceil(total / limit)
            })


        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }

    getRequestHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cookie = req.cookies['jwt'];
            const { _id } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JwtPayload;
            const filter = {
                relations: ["creditor", "debitor"],
                where: [
                    { creditor: { id: _id }, debitor: { is_admin: true } },
                    { debitor: { id: _id }, creditor: { is_admin: true } },
                ]
            }
           
            const page = parseInt(req.query.page as any) || 1;
            const limit = parseInt(req.query.limit as any) || 10;
            const offset = (page - 1) * limit;
            const total = await this.transactionRepository.count(filter);

            const history = await this.transactionRepository.find({
                ...filter,
                skip: offset,
                take: limit,
                order: {
                    created_at: "DESC"
                }
            });

            return res.status(200).json({
                total: total,
                page: page,
                data: history,
                limit: limit,
                last_page: Math.ceil(total / limit),
            })
        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }
}

export default new HistoryController()
