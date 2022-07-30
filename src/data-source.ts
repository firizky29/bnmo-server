import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./models/User"
import { CONST } from "./constants/constant"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: CONST.MYSQL_USER,
    password: CONST.MYSQL_PASSWORD,
    database: CONST.MYSQL_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
