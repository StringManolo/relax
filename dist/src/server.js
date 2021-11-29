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
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/", (request, response) => {
    response.json({
        info: "SNR API"
    });
});
app.post("/auth", queries_1.authUser);
app.use(authMiddleware_1.default); /* request token for any other API endpoint */
app.get("/users", queries_1.getUsers);
app.get("/users/:id", queries_1.getUserById);
app.post("/users", queries_1.createUser);
app.put("/users/:id", queries_1.updateUser);
app.delete("/users/:id", queries_1.deleteUser);
app.put("/users/:id/:bio", queries_1.updateUserBio);
app.listen(port, () => {
    console.log("Server binded to localhost:" + port);
});
/* </main> */
