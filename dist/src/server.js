"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
