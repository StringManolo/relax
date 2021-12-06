"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsMiddleware = (request, response, next) => {
    var _a;
    response.header("Access-Control-Allow-Origin", ((_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.origin) || "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
};
exports.default = corsMiddleware;
