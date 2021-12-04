"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
/* TODO: Strip for production, test and fill with real credentials */
const pool = new pg_1.Pool({
    user: "snradmin",
    host: "localhost",
    database: "snr",
    password: "tmp",
    port: 5432
});
exports.default = pool;
