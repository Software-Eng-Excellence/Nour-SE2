import config from "../config";
import winston from "winston";   

const {logDir,isDev} = config; 

const logFileFormate = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.splat(),
    winston.format.errors({stack: true}),
)

const logConsoleFormate = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({format:"HH:mm:ss"}),
    winston.format.errors({stack: true}),
    winston.format.splat(),
    winston.format.printf(({level, message, timestamp, stack, ...meta}) => {
        let metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
        return `[${timestamp}] ${level}: ${message} ${stack || ""}${metaStr}`;
    }),
);
const logger = winston.createLogger({
    level:"info",
    transports:[
        new winston.transports.File({filename:"error.log", dirname:logDir , level:"error", format: logFileFormate}),
        new winston.transports.File({filename:"all.log", dirname:logDir,format: logFileFormate})
    ],
    exceptionHandlers:[
        new winston.transports.File({filename:"exceptions.log" , dirname:logDir})
    ]
});

if(isDev){
    logger.add(new winston.transports.Console({format:logConsoleFormate})),  
    logger.level = "debug"
}
export default logger;