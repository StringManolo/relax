import pool from "./pool";
import { Request, Response, NextFunction } from "express";

const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const token = request?.headers?.authorization;

  if (token) {
    pool.query("SELECT * FROM users WHERE token = $1", [token], (error, results) => {
      if (error) {
        return;
      }

      if (results?.rows[0]?.id) {
        request.headers["user_id"] = results.rows[0].id; // ugly way to pass id to next end point
        next();
      } else {
        response.status(401).json({ error: "wrong token"});
      }
    });
  } else {
    response.status(401).json({ error: "missing token"});
  }
}

export default authMiddleware;
