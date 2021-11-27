"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_jwt_1 = __importDefault(require("express-jwt"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
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
const checkJwt = (0, express_jwt_1.default)({
    secret: jwks_rsa_1.default.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://stringmanolo.eu.auth0.com/.well-known/jwks.json"
    }),
    // Validate the audience and the issuer.
    audience: "https://snr",
    issuer: "https://stringmanolo.eu.auth0.com/",
    algorithms: ["RS256"]
});
app.use(checkJwt);
app.use((error, request, response, next) => {
    if (error.name === "UnauthorizedError") {
        response.status(error.status).send({ message: error.message });
        return;
    }
    next();
});
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
