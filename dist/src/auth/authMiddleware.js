"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = __importDefault(require("./pool"));
// allows to auth using cookies(browser) or token(cli)
const authMiddleware = (request, response, next) => {
    var _a, _b;
    const cookieToken = (_a = request === null || request === void 0 ? void 0 : request.cookies) === null || _a === void 0 ? void 0 : _a.tokenCookie; // make sure to have app.use(express.cookieParser()); before app.use(authMiddleware);
    let token;
    if (cookieToken) {
        token = cookieToken;
    }
    else {
        token = (_b = request === null || request === void 0 ? void 0 : request.headers) === null || _b === void 0 ? void 0 : _b.authorization;
    }
    if (token) {
        pool_1.default.query("SELECT * FROM users WHERE token = $1", [token], (error, results) => {
            var _a;
            if (error) {
                response.status(401).send({ error: "wrong token" });
                return;
            }
            if ((_a = results === null || results === void 0 ? void 0 : results.rows[0]) === null || _a === void 0 ? void 0 : _a.id) {
                request.headers["user_id"] = results.rows[0].id; // ugly way to pass id to next end point
                next();
            }
            else {
                response.status(401).send({ error: "wrong token" });
                return;
            }
        });
    }
    else {
        response.status(401).send({ error: "missing token" });
        return;
    }
};
exports.default = authMiddleware;
