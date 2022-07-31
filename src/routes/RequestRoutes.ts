import BaseRoutes from "./BaseRoutes";

// controllers
import RequestController from "../controllers/RequestController";

// middlewares
import { admin } from "../middlewares/AdminMiddleware";
import { user } from "../middlewares/UserMiddleware";

class RequestRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.post("/", user, RequestController.createRequest);
        this.routes.get("/", admin, RequestController.getAllRequest);
        this.routes.get("/:transaction_status", admin, RequestController.getRequest);
        this.routes.put("/:id", admin, RequestController.updateRequest);
    }
}

export default new RequestRoutes().routes;