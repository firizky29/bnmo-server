import BaseRoutes from "./BaseRoutes";

// controllers
import UserController from "../controllers/UserController";

// middlewares
import { admin } from "../middlewares/AdminMiddleware";

class UserRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.get("/:verification_status", admin, UserController.getUser);
        this.routes.put("/:username", admin, UserController.updateUser);
    }
}

export default new UserRoutes().routes;