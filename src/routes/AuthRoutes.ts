import BaseRoutes from "./BaseRoutes";

// controllers
import AuthController from "../controllers/AuthController";

// middlewares
import { auth } from "../middlewares/AuthMiddleware";
import { unauth } from "../middlewares/UnauthMiddleware";

class AuthRoutes extends BaseRoutes {
    public setRoutes(): void {
        this.routes.post("/login", unauth, AuthController.login);
        this.routes.post("/register", unauth, AuthController.register);
        this.routes.post("/logout", auth, AuthController.logout);
        this.routes.get("/profile", auth, AuthController.profile);
    }
}

export default new AuthRoutes().routes;