"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const authMiddleware_1 = __importDefault(require("./auth/authMiddleware"));
const queries_1 = require("./queries");
const app = (0, express_1.default)();
const port = 3000;
const exit = (exitMsg) => {
    console.error(exitMsg);
    process.exit(-1);
};
/* <main> */
app.use(body_parser_1.default.json()); // allow to easily get body arguments from requests
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/", queries_1.getAPIDoc); // show how to use the API
app.get("/exists/:username", queries_1.testUsernameExists); // test if the username is already taken
app.post("/signin", queries_1.signin); // register your account
app.post("/verification", queries_1.verificateCode);
// TODO: validate verification code endpoint
app.post("/auth", queries_1.authUser); // request your token using credentials
app.use(authMiddleware_1.default); // request token for next API endpoints
app.get("/users", queries_1.getUsers); // not finished endpoints: 
app.get("/users/:id", queries_1.getUserById);
app.post("/users", queries_1.createUser); // test only
app.put("/users/:id", queries_1.updateUser);
app.delete("/users/:id", queries_1.deleteUser);
app.put("/users/:id/:bio", queries_1.updateUserBio);
app.get("/users/:id/posts", queries_1.getUserPosts); // Get all posts from an user
app.post("/users/post", queries_1.createUserPost); // Create a post from current user
app.put("/users/post", queries_1.editUserPost); // Edit a post from current user
app.delete("/users/post", queries_1.deleteUserPost); // Delete a post from current user;
app.listen(port, () => {
    console.log("Server binded to localhost:" + port);
});
/* </main> */
