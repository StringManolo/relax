import express, { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import bodyParser from "body-parser";

import jwt from "jsonwebtoken";
import key from "./auth/jwtkey";

import { 
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  authUser,

  updateUserBio
} from "./queries";

const app = express();
const port = 3000;

const exit = (exitMsg: string) => {
  console.error(exitMsg);
  process.exit(-1);
}

/* <main> */
app.set("key", key);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({
    info: "SNR API"
  });
});

app.get("/users", getUsers);
app.get("/users/:id", getUserById);
app.post("/users", createUser);
app.post("/auth", authUser);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

app.put("/users/:id/:bio", updateUserBio);


app.listen(port, () => {
  console.log("Server binded to localhost:" + port);
});
/* </main> */
