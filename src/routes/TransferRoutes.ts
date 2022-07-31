import BaseRoutes from "./BaseRoutes";

// controllers
import TransferController from "../controllers/TransferController";

// middlewares
import { user } from "../middlewares/UserMiddleware";

class TransferRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.post("/", user, TransferController.createTransfer);
    }
}

export default new TransferRoutes().routes;