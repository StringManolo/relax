import pool from "./pool";
import { Request, Response, NextFunction } from "express";

// allows to auth using cookies(browser) or token(cli)
const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const cookieToken = request?.cookies?.tokenCookie; // make sure to have app.use(express.cookieParser()); before app.use(authMiddleware);
  let token;
  if (cookieToken) {
    token = cookieToken;
  } else {
    token = request?.headers?.authorization;
  }

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
