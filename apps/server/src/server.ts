import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import config from '../config.json';
import { getFilesWithKeyword } from './utils/getFilesWithKeyword';

const app: Express = express();

/************************************************************************************
 *                              Basic Express Middlewares
 ***********************************************************************************/

// -------------------
// Rate-limit settings
// -------------------
// const GLOBAL_LIMIT = 100;
// const GLOBAL_WINDOW = 60000; // 1 minute

// const ENDPOINT_LIMIT = 3;
// const ENDPOINT_WINDOW = 1000; // 1 second

// var globalCount = 0;
// var globalWindowStart = Date.now();

// interface EndpointInfo {
//   count: number;
//   windowStart: number;
// }

// const endpointMap: Record<string, EndpointInfo> = {};


// const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
//   const now = Date.now();

//   if (now - globalWindowStart >= GLOBAL_WINDOW) {
//     globalCount = 0;
//     globalWindowStart = now;
//   }

//   if (globalCount >= GLOBAL_LIMIT) {
//     return res.status(429).send('Too Many Requests (global limit)');
//   }

//   const endpoint = req.path;
//   const endpointInfo = endpointMap[endpoint] || {
//     count: 0,
//     windowStart: now,
//   };

//   if (now - endpointInfo.windowStart >= ENDPOINT_WINDOW) {
//     endpointInfo.count = 0;
//     endpointInfo.windowStart = now;
//   }

//   if (endpointInfo.count >= ENDPOINT_LIMIT) {
//     return res.status(429).send('Too Many Requests (endpoint limit)');
//   }

//   globalCount += 1;
//   endpointInfo.count += 1;
//   endpointMap[endpoint] = endpointInfo;

//   next();
// }

// app.use(rateLimiter);

app.set('json spaces', 4);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle logs in console during development
if (process.env.NODE_ENV === 'development' || config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use(cors());
}

// Handle security and origin in production
if (process.env.NODE_ENV === 'production' || config.NODE_ENV === 'production') {
  app.use(helmet());
}

/************************************************************************************
 *                               Register all routes
 ***********************************************************************************/

getFilesWithKeyword('router', __dirname + '/app').forEach((file: string) => {
  const { router } = require(file);
  app.use('/', router);
})
/************************************************************************************
 *                               Express Error Handling
 ***********************************************************************************/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  return res.status(500).json({
    errorName: err.name,
    message: err.message,
    stack: err.stack || 'no stack defined'
  });
});

export default app;