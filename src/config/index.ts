import dotenv from "dotenv"
import path from "path"
import { DBMode } from "../model/DBModes.model";
dotenv.config({path: path.join(__dirname,'../../.env')})


export default{
    logDir: process.env.LOG_DIR || "./logs",
    isDev: process.env.NODE_ENV === "development",
    storagePath: {
        csv: {
            cake: "src/data/cake orders.csv"
        },
        sqlite: "src/data/orders.db",
        psql: process.env.DATABASE_URL,
    },
    port: process.env.PORT ?parseInt(process.env.PORT): 3000,
    host: process.env.HOST || "localhost",
    dbMode: DBMode.SQLITE,
    // dbMode: DBMode.POSTGRESQL,
}
