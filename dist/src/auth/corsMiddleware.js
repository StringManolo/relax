"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsMiddleware = (request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
};
exports.default = corsMiddleware;
