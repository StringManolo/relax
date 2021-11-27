import express, { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import bodyParser from "body-parser";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

import { 
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,

  updateUserBio
} from "./queries";

const app = express();
const port = 3000;

const exit = (exitMsg: string) => {
  console.error(exitMsg);
  process.exit(-1);
}

/* <main> */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({
    info: "SNR API"
  });
});

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://stringmanolo.auth0.com/.well-known/jwks.json"
  }),

  // Validate the audience and the issuer.
  audience: "https://snr",
  issuer: "https://stringmanolo.auth0.com/",
  algorithms: ["RS256"]
});

app.use(checkJwt);
app.use((error: HttpError, request: Request, response: Response, next: NextFunction) => {
  if (error.name === "UnauthorizedError") {
    response.status(error.status).send({ message: error.message });
    return;
  }
 next();
});

app.get("/users", getUsers);
app.get("/users/:id", getUserById);
app.post("/users", createUser);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

app.put("/users/:id/:bio", updateUserBio);

app.listen(port, () => {
  console.log("Server binded to localhost:" + port);
});
/* </main> */
