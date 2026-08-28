import express, { response } from 'express';
import config  from './config';
import logger from './util/logger';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import requestLogger from './middleware/requestLogger';
import routes from './routes';
import { ApiException } from './util/exceptions/ApiException';
import { NextFunction, Response, Request } from "express";

const app = express();

//  config helmet
app.use(helmet());

// config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config cors 
app.use(cors());

// config midleware
app.use(requestLogger);

// config routes 
app.use('/', routes)

// config 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});

// config Error Handler
app.use((err:Error , req: Request , res: Response ,next: NextFunction) => {
    if(err instanceof ApiException){
        const apiException = err as ApiException;
        logger.error("API exception of status %d: %s", apiException.status , err.message)
        res.status(apiException.status).json({error:err.message})
    }else{
        logger.error("Unhandeled Error: %s " , err.message)
        res.status(500).json({error:"Internal Servar Error"})
    }
});

app.listen(config.port, config.host ,() => {
    logger.info('Server is running on http://%s:%d', config.host, config.port);
});
