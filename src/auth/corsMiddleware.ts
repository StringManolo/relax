import { Request, Response, NextFunction } from "express";

const corsMiddleware = (request: Request, response: Response, next: NextFunction) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}

export default corsMiddleware;
