import express, { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import authMiddleware from "./auth/authMiddleware";
import corsMiddleware from "./auth/corsMiddleware"; // allow test localhost for dev

import { 
  getAPIDoc,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  authUser,

  updateUserBio,

  getUserPosts,
  createUserPost,
  editUserPost,
  deleteUserPost,

  signin,
  verificateCode,
  testUsernameExists,
  getProfile,

  search,
  getUserByUsername,
  getPostsByUsername,
  getFriends,
  getFriendsByUsername,
  addFriendByUsername
} from "./queries";

const app = express();
const port = 3000;

const exit = (exitMsg: string) => {
  console.error(exitMsg);
  process.exit(-1);
}


app.use(corsMiddleware); // allow test localhost for dev
app.use(cookieParser()); // parse cookies, needed for authMiddleware

/* <main> */
app.use(bodyParser.json()); // allow to easily get body arguments from requests
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", getAPIDoc); // show how to use the API
app.get("/exists/:username", testUsernameExists); // test if the username is already taken
app.post("/signin", signin); // register your account
app.post("/verification", verificateCode);
app.post("/auth", authUser); // request your token using credentials

app.use(authMiddleware); // request token for next API endpoints
app.post("/users/bio", updateUserBio); // updates the user bio


app.get("/profile", getProfile); // get profile from current user
app.get("/posts", getUserPosts); // get posts from current user
app.get("/friends", getFriends); // get friends from current user
app.post("/users/post", createUserPost); // Create a post from current user
app.get("/search/:search", search);

// app.get("/friends/username/:username", getFriendsByUsername);
app.post("/friends/username/", addFriendByUsername);
app.get("/users/username/:username", getUserByUsername);
app.get("/posts/username/:username", getPostsByUsername);

// creategroup, publish in group, delete post, edit post,

/* Redesigning next endpoint: */
/*
app.get("/users", getUsers); // not finished endpoints: 
app.get("/users/:id", getUserById);
app.post("/users", createUser); // test only
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

// app.get("/users/:id/posts", getUserPosts); // Get all posts from an user
app.post("/users/post", createUserPost); // Create a post from current user
app.put("/users/post", editUserPost); // Edit a post from current user
app.delete("/users/post", deleteUserPost); // Delete a post from current user;
*/

app.listen(port, () => {
  console.log("Server binded to localhost:" + port);
});
/* </main> */
