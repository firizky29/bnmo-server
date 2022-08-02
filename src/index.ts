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
import RequestRoutes from "./routes/RequestRoutes"
import TransferRoutes from "./routes/TransferRoutes"
import HistoryRoutes from "./routes/HistoryRoutes"
import Admin from "./models/Admin"


class App {
    public app: Application;

    constructor() {
        
        this.app = express();
        this.setMiddlewares();
        this.setRoutes();
        this.initDB();
    }

    private setMiddlewares() {
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(morgan("dev"));
        this.app.use(cors({origin: 'http://localhost:3000', credentials: true}));
        this.app.use(helmet());
        this.app.use(cookieParser());
    }

    private setRoutes() {
        this.app.use("/api/v1/auth", AuthRoutes);
        this.app.use("/api/v1/users", UserRoutes);
        this.app.use("/api/v1/request", RequestRoutes);
        this.app.use("/api/v1/transfer", TransferRoutes);
        this.app.use("/api/v1/history", HistoryRoutes);
        // this.app.use("/api", new Routes(this.app).routes);
    }

    private initDB() {
        AppDataSource.initialize().then(() => {
            console.log("Data Source has been initialized!")
            Admin.init()
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

