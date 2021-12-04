import pool from "./pool";
import { Request, Response, NextFunction } from "express";

const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const token = request?.headers?.authorization;

  if (token) {
    pool.query("SELECT * FROM users WHERE token = $1", [token], (error, results) => {
      if (error) {
	response.status(401).send({ error: "wrong token"});
        return;
      }

      if (results?.rows[0]?.id) {
        request.headers["user_id"] = results.rows[0].id; // ugly way to pass id to next end point
        next();
      } else {
        response.status(401).send({ error: "wrong token"});
	return;
      }
    });
  } else {
    response.status(401).send({ error: "missing token"});
    return;
  }
}

export default authMiddleware;
