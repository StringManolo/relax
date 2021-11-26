"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 3000;
const exit = (exitMsg) => {
    console.error(exitMsg);
    process.exit(-1);
};
const config = {
    user: "stringmanolo",
    host: "localhost",
    password: "temp",
    port: 5432
};
/* <main> */
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/", (request, response) => {
    response.json({
        info: "SNR API"
    });
});
app.listen(port, () => {
    console.log("Server binded to localhost:" + port);
});
/* </main> */
