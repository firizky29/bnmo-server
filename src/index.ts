import express, { Application } from "express"
import bodyParser from "body-parser"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import { AppDataSource } from "./data-source"
import { CONST } from "./constants/constant"
import cookieParser from "cookie-parser"

// Routes
import AuthRoutes from "./routes/AuthRoutes"
import UserRoutes from "./routes/UserRoutes"


class App {
    public app: Application;

    constructor() {
        
        this.app = express();
        this.setMiddlewares();
        this.setRoutes();
        this.initDB();
    }

    private setMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(morgan("dev"));
        this.app.use(cors({origin: true, credentials: true}));
        this.app.use(helmet());
        this.app.use(cookieParser());
    }

    private setRoutes() {
        this.app.use("/api/v1/auth", AuthRoutes);
        this.app.use("/api/v1/users", UserRoutes);
        // this.app.use("/api", new Routes(this.app).routes);
    }

    private initDB() {
        AppDataSource.initialize().then(() => {
            console.log("Data Source has been initialized!")
        })
        .catch((err) => {
            console.error("Error during Data Source initialization", err)
        })

    }

}

const app = new App().app;
app.listen(CONST.PORT, () => {
    console.log(`Server is running on port ${CONST.PORT}`);
});
