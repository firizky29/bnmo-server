import "dotenv/config";

export const CONST = {
    PORT: process.env.PORT || 3100,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
}