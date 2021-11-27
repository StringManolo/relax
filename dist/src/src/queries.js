"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserBio = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const pool_1 = __importDefault(require("./pool"));
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
const updateUserBio = (request, response) => {
    console.log("Updating bio...");
    const { bio } = request.body;
    pool_1.default.query("UPDATE users SET bio = $1 WHERE id = $2", [bio, +request.params.id], (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        }
        response.status(200).send(`Bio updated`);
    });
};
exports.updateUserBio = updateUserBio;
