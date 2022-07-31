import BaseRoutes from "./BaseRoutes";

// controllers
import HistoryController from "../controllers/HistoryController";

// middlewares
import { user } from "../middlewares/UserMiddleware";

class TransferRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.get("/", user, HistoryController.getAllHistory);
        this.routes.get("/transfer", user, HistoryController.getTransferHistory);
        this.routes.get("/request", user, HistoryController.getRequestHistory);
    }
}

export default new TransferRoutes().routes;