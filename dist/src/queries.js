"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserBio = exports.authUser = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const pool_1 = __importDefault(require("./pool"));
const crypto_1 = __importDefault(require("crypto"));
const getUsers = (request, response) => {
    pool_1.default.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};
exports.getUsers = getUsers;
const getUserById = (request, response) => {
    pool_1.default.query("SELECT * FROM users WHERE id = $1", [+request.params.id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};
exports.getUserById = getUserById;
const createUser = (request, response) => {
    const { name, email } = request.body;
    pool_1.default.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id", [name, email], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    });
};
exports.createUser = createUser;
const updateUser = (request, response) => {
    const { name, email } = request.body;
    pool_1.default.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, +request.params.id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User modified with ID: ${+request.params.id}`);
    });
};
exports.updateUser = updateUser;
const deleteUser = (request, response) => {
    pool_1.default.query("DELETE FROM users WHERE id = $1", [+request.params.id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${+request.params.id}`);
    });
};
exports.deleteUser = deleteUser;
const authUser = (request, response) => {
    const { username, email, password } = request.body;
    if (!password) {
        //throw new Error("Password missing");
        response.status(400).json({ missing: "password" });
        return;
    }
    if (!username && !email) {
        //throw new Error("Username or Email missing");
        response.status(400).json({ missing: "username || email" });
        return;
    }
    if (username) {
        pool_1.default.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password], (error, results) => {
            var _a;
            if (error) {
                // throw Error;
                response.status(401).json({ error: "wrong credentials" });
                return;
            }
            // @ts-ignore
            if (((_a = results === null || results === void 0 ? void 0 : results.rows[0]) === null || _a === void 0 ? void 0 : _a.username) === username) {
                const token = crypto_1.default.randomBytes(64).toString("hex");
                pool_1.default.query("UPDATE users SET token = $1 WHERE username = $2 AND password = $3", [token, username, password], (error, results) => {
                    if (error) {
                        // throw Error;
                        response.status(200).json({ error: error.message });
                        return;
                    }
                    response.status(200).json({ token: token });
                    return;
                });
            }
            else {
                response.status(401).json({ error: "wrong credentials" });
                return;
            }
        });
    }
    else /* email */ {
        pool_1.default.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password], (error, results) => {
            var _a;
            if (error) {
                // throw Error;
                response.status(401).json({ error: "wrong credentials" });
                return;
            }
            // @ts-ignore
            if (((_a = results === null || results === void 0 ? void 0 : results.rows[0]) === null || _a === void 0 ? void 0 : _a.email) === email) {
                const token = crypto_1.default.randomBytes(64).toString("hex");
                pool_1.default.query("UPDATE users SET token = $1 WHERE email = $2 AND password = $3", [token, email, password], (error, results) => {
                    if (error) {
                        response.status(200).json({ error: error.message });
                        return;
                    }
                    response.status(200).json({ token: token });
                    return;
                });
            }
            else {
                response.status(401).json({ error: "wrong credentials" });
                return;
            }
        });
    }
    return;
};
exports.authUser = authUser;
const updateUserBio = (request, response) => {
    const { bio } = request.body;
    pool_1.default.query("UPDATE users SET bio = $1 WHERE id = $2", [bio, +request.params.id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Bio updated`);
    });
};
exports.updateUserBio = updateUserBio;
