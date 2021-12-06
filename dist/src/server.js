"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authMiddleware_1 = __importDefault(require("./auth/authMiddleware"));
const corsMiddleware_1 = __importDefault(require("./auth/corsMiddleware")); // allow test localhost for dev
const queries_1 = require("./queries");
const app = (0, express_1.default)();
const port = 3000;
const exit = (exitMsg) => {
    console.error(exitMsg);
    process.exit(-1);
};
app.use(corsMiddleware_1.default); // allow test localhost for dev
app.use((0, cookie_parser_1.default)()); // parse cookies, needed for authMiddleware
/* <main> */
app.use(body_parser_1.default.json()); // allow to easily get body arguments from requests
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/", queries_1.getAPIDoc); // show how to use the API
app.get("/exists/:username", queries_1.testUsernameExists); // test if the username is already taken
app.post("/signin", queries_1.signin); // register your account
app.post("/verification", queries_1.verificateCode);
app.post("/auth", queries_1.authUser); // request your token using credentials
app.use(authMiddleware_1.default); // request token for next API endpoints
app.put("/users/bio", queries_1.updateUserBio); // updates the user bio
app.get("/profile", queries_1.getProfile); // get profile from current user
app.get("/posts", queries_1.getUserPosts); // get posts from current user
app.get("/friends", queries_1.getFriends); // get friends from current user
app.post("/users/post", queries_1.createUserPost); // Create a post from current user
app.get("/search/:search", queries_1.search);
// app.get("/friends/username/:username", getFriendsByUsername);
app.post("/friends/username/", queries_1.addFriendByUsername);
app.get("/users/username/:username", queries_1.getUserByUsername);
app.get("/posts/username/:username", queries_1.getPostsByUsername);
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
