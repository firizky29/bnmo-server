import BaseRoutes from "./BaseRoutes";

// controllers
import AuthController from "../controllers/AuthController";

// middlewares
import { auth } from "../middlewares/AuthMiddleware";

class AuthRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.post("/login", AuthController.login);
        this.routes.post("/register", AuthController.register);
        this.routes.post("/logout", auth, AuthController.logout);
        this.routes.get("/profile", auth, AuthController.profile);
    }
}

export default new AuthRoutes().routes;