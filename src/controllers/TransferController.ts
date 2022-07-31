import { NextFunction, Request, Response } from "express"
import { CONST } from "../constants/constant";
import BaseController from "./BaseController";
import jwt from "jsonwebtoken";
import { Transaction } from "../models/Transaction";

interface JwtPayload {
    _id: string
}

class TransferController extends BaseController {
    createTransfer = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id, amount } = req.body;
            const cookie = req.cookies['jwt'];
            const { _id } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JwtPayload;


            const creditor = await this.userRepository.findOne({ where: { id: _id } });
            const debitor = await this.userRepository.findOne({ where: { id } });

            if (creditor && debitor) {
                const newTransaction = new Transaction()
                newTransaction.creditor = creditor
                newTransaction.debitor = debitor
                newTransaction.amount = amount
                newTransaction.transaction_status = "accepted"

                await this.transactionRepository.save(newTransaction)
                return res.status(200).json({ message: "Transfer Success" })
            }
            else {
                return res.status(404).send({ message: "User Not Found" })
            }


        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }
}

export default new TransferController()