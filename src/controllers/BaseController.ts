import { AppDataSource } from "../data-source"
import { User } from "../models/User"
import { Transaction } from "../models/Transaction"

abstract class BaseController {
    protected userRepository;
    protected transactionRepository;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User)
        this.transactionRepository = AppDataSource.getRepository(Transaction)
    }
}

export default BaseController;