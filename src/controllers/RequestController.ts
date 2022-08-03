import { NextFunction, Request, Response } from "express"
import BaseController from "./BaseController";
import { CONST } from "../constants/constant";
import jwt from "jsonwebtoken";
import { Transaction } from "../models/Transaction";
import Admin from "../models/Admin";

interface JwtPayload {
    _id: string
}


class RequestController extends BaseController {
    getAllRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filter = {
                relations: ["creditor", "debitor"],
                where: [
                    { debitor: { is_admin: true } },
                    { creditor: { is_admin: true } },
                ]
            }

            const page = parseInt(req.query.page as any) || 1;
            const limit = parseInt(req.query.limit as any) || 10;
            const offset = (page - 1) * limit;
            const total = await this.transactionRepository.count(filter);

            const requests = await this.transactionRepository.find({
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
                data: requests,
                limit: limit,
                last_page: Math.ceil(total / limit)
            })

        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }

    getRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filter = {
                relations: ["creditor", "debitor"],
                where: [
                    { debitor: { is_admin: true }, transaction_status: req.params.transaction_status },
                    { creditor: { is_admin: true }, transaction_status: req.params.transaction_status },
                ]
            }

            const page = parseInt(req.query.page as any) || 1;
            const limit = parseInt(req.query.limit as any) || 10;
            const offset = (page - 1) * limit;
            const total = await this.transactionRepository.count(filter);

            const requests = await this.transactionRepository.find({
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
                data: requests,
                limit: limit,
                last_page: Math.ceil(total / limit),
                order: {
                    created_at: "DESC"
                }
            })
        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }

    createRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type, amount } = req.body;
            const cookie = req.cookies['jwt'];
            const { _id } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JwtPayload;


            let creditor = null
            let debitor = null
            if (type === "debit") {
                creditor = Admin.getInstance()
                debitor = await this.userRepository.findOne({ where: { id: _id } });
            } else if(type === "withdraw") {
                creditor = await this.userRepository.findOne({ where: { id: _id } });
                debitor = Admin.getInstance()
            } else{
                return res.status(400).send({ message: "Invalid type" })
            }

            if (!creditor || !debitor) {
                return res.status(404).send({ message: "User Not Found" })
            }
            else {
                const newTransaction = new Transaction()
                if(creditor){
                    newTransaction.creditor = creditor
                }
                if(debitor){
                    newTransaction.debitor = debitor
                }
                newTransaction.amount = amount
                newTransaction.transaction_status = "pending"

                await this.transactionRepository.save(newTransaction)
                return res.status(200).json({ message: "Request Has Been Sent" })
            }

        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }

    updateRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const request = await this.transactionRepository.findOne({ 
                relations: ["creditor", "debitor"],
                where: { id: req.params.id } 
            })

            if (!request) {
                return res.status(404).send({ message: "Request not found" })
            }
            request.transaction_status = req.body.transaction_status
            await this.transactionRepository.save(request)
            return res.status(200).send({ message: "Request updated" })
        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }
}

export default new RequestController()