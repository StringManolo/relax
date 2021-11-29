"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = __importDefault(require("./pool"));
const authMiddleware = (request, response, next) => {
    var _a;
    const token = (_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    if (token) {
        pool_1.default.query("SELECT * FROM users WHERE token = $1", [token], (error, results) => {
            var _a;
            if (error) {
                return;
            }
            if ((_a = results === null || results === void 0 ? void 0 : results.rows[0]) === null || _a === void 0 ? void 0 : _a.id) {
                request.headers["user_id"] = results.rows[0].id; // ugly way to pass id to next end point
                next();
            }
            else {
                response.status(401).json({ error: "wrong token" });
            }
        });
    }
    else {
        response.status(401).json({ error: "missing token" });
    }
};
exports.default = authMiddleware;
