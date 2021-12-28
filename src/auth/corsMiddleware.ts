import { Request, Response, NextFunction } from "express";

const corsMiddleware = (request: Request, response: Response, next: NextFunction) => {
  response.header("Access-Control-Allow-Origin", request?.headers?.origin || "*");
  response.header("Access-Control-Allow-Credentials", "true");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  /*
  response.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  response.header("Allow", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  */
  next();
}

export default corsMiddleware;
