"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testUsernameExists = exports.verificateCode = exports.signin = exports.deleteUserPost = exports.editUserPost = exports.createUserPost = exports.getUserPosts = exports.updateUserBio = exports.authUser = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = exports.getAPIDoc = void 0;
const pool_1 = __importDefault(require("./auth/pool"));
const sendMail_1 = __importDefault(require("./auth/sendMail"));
const hash_1 = __importDefault(require("./auth/hash"));
const hashWithIV_1 = __importDefault(require("./auth/hashWithIV"));
const crypto_1 = __importDefault(require("crypto"));
const getAPIDoc = (request, response) => {
    response.status(200).json({ info: "SNR API" });
};
exports.getAPIDoc = getAPIDoc;
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
        pool_1.default.query("SELECT * FROM users WHERE username = $1" /* AND password = $2"*/, [username /*, password*/], (error, results) => {
            var _a;
            if (error) {
                response.status(401).json({ error: error.message });
                return;
            }
            // @ts-ignore
            if (((_a = results === null || results === void 0 ? void 0 : results.rows[0]) === null || _a === void 0 ? void 0 : _a.username) === username) {
                if ((results === null || results === void 0 ? void 0 : results.rows[0]["is_active"]) !== true) {
                    response.status(401).json({ error: "Account not activated yet. Check your email for verification code" });
                    return;
                }
                const token = crypto_1.default.randomBytes(64).toString("hex");
                // get IV from database
                pool_1.default.query("SELECT * FROM users WHERE username = $1", [username], (error, results) => {
                    var _a, _b;
                    if (error) {
                        response.status(401).json({ error: error.message });
                        return;
                    }
                    let iv = "";
                    if ((_a = results.rows[0]) === null || _a === void 0 ? void 0 : _a.password) {
                        if (/\:/.test((_b = results.rows[0]) === null || _b === void 0 ? void 0 : _b.password)) {
                            iv = results.rows[0].password.split(":")[0];
                        }
                        else {
                            response.status(401).json({ error: "Unable to retrieve IV" });
                        }
                    }
                    else {
                        response.status(401).json({ error: "Unable to retrieve IV" });
                        return;
                    }
                    (() => __awaiter(void 0, void 0, void 0, function* () {
                        var _c;
                        const userHashedPassword = yield (0, hashWithIV_1.default)(password, iv);
                        if (userHashedPassword === ((_c = results.rows[0]) === null || _c === void 0 ? void 0 : _c.password)) {
                            pool_1.default.query("UPDATE users SET token = $1 WHERE username = $2 AND password = $3", [token, username, userHashedPassword], (error, results) => {
                                if (error) {
                                    response.status(401).json({ error: error.message });
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
                    }))();
                });
            }
            else {
                response.status(401).json({ error: "wrong credentials" });
                return;
            }
        });
    }
    else /* email */ {
        pool_1.default.query("SELECT * FROM users WHERE email = $1" /* AND password = $2"*/, [email /*, password*/], (error, results) => {
            var _a;
            if (error) {
                // throw Error;
                response.status(401).json({ error: "wrong credentials" });
                return;
            }
            // @ts-ignore
            if (((_a = results === null || results === void 0 ? void 0 : results.rows[0]) === null || _a === void 0 ? void 0 : _a.email) === email) {
                if ((results === null || results === void 0 ? void 0 : results.rows[0]["is_active"]) !== true) {
                    response.status(401).json({ error: "Account not activated yet. Check your email for verification code" });
                    return;
                }
                const token = crypto_1.default.randomBytes(64).toString("hex");
                // get IV from database 
                pool_1.default.query("SELECT * FROM users WHERE email = $1", [email], (error, results) => {
                    var _a, _b;
                    if (error) {
                        response.status(401).json({ error: error.message });
                        return;
                    }
                    let iv = "";
                    if ((_a = results.rows[0]) === null || _a === void 0 ? void 0 : _a.password) {
                        if (/\:/.test((_b = results.rows[0]) === null || _b === void 0 ? void 0 : _b.password)) {
                            iv = results.rows[0].password.split(":")[0];
                        }
                        else {
                            response.status(401).json({ error: "Unable to retrieve IV" });
                        }
                    }
                    else {
                        response.status(401).json({ error: "Unable to retrieve IV" });
                        return;
                    }
                    (() => __awaiter(void 0, void 0, void 0, function* () {
                        var _c;
                        const userHashedPassword = yield (0, hashWithIV_1.default)(password, iv);
                        if (userHashedPassword === ((_c = results.rows[0]) === null || _c === void 0 ? void 0 : _c.password)) {
                            pool_1.default.query("UPDATE users SET token = $1 WHERE email = $2 AND password = $3", [token, email, userHashedPassword], (error, results) => {
                                if (error) {
                                    response.status(401).json({ error: error.message });
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
                    }))();
                });
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
            //throw error;
            console.log(error);
            return;
        }
        response.status(200).send(`Bio updated`);
    });
};
exports.updateUserBio = updateUserBio;
/* POSTS (PUBLICACIONES) */
const getUserPosts = (request, response) => {
    const userID = request === null || request === void 0 ? void 0 : request.headers["user_id"];
    if (userID) {
        pool_1.default.query("SELECT * FROM posts WHERE user_id = $1 ORDER BY post_id DESC", [userID], (error, results) => {
            if (error) {
                response.status(401).json({ error: error.message });
                return;
            }
            response.status(200).json(results.rows);
        });
    }
};
exports.getUserPosts = getUserPosts;
const createUserPost = (request, response) => {
    const { title, post } = request.body;
    const userID = request === null || request === void 0 ? void 0 : request.headers["user_id"]; // this header is internal, set by authMiddleware
    if (userID) {
        pool_1.default.query("INSERT INTO posts (user_id, title, post) VALUES ($1, $2, $3)", [userID, title, post], (error, results) => {
            if (error) {
                console.log(error);
                return;
            }
            response.status(200).send({ status: "Done" });
        });
    }
    else {
    }
};
exports.createUserPost = createUserPost;
const editUserPost = () => { };
exports.editUserPost = editUserPost;
const deleteUserPost = () => { };
exports.deleteUserPost = deleteUserPost;
const signin = (request, response) => {
    const { phone, email, username, password, firstName, lastName, middleName, gender, country, profilePictureUrl } = request.body;
    const rol = "user";
    const verificationCode = crypto_1.default.randomInt(0, 999999);
    console.log("VER-CODE: " + verificationCode); // print in console for debug (avoid open emails constantly
    const isActive = false;
    const isReported = false;
    const isBlocked = false;
    const bio = "";
    if (!/^\d+$/.test(phone)) {
        response.status(401).send({ error: "phone number not valid format" });
        return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        response.status(401).send({ error: "email not valid format" });
        return;
    }
    if (!/^\w+$/.test(username)) {
        response.status(401).send({ error: "username not valid format" });
        return;
    }
    if (password.length < 8 || password.length > 100) {
        response.status(401).send({ error: "password is to short or to long" });
        return;
    }
    // TODO: Force password to be stronger
    if (!firstName) {
        response.status(401).send({ error: "missing firstName" });
        return;
    }
    const trimedFirstName = firstName.replace(/\s\s+/g, " ").trim();
    if (trimedFirstName.length < 2) {
        response.status(401).send({ error: "firstname is to short after removing spaces" });
        return;
    }
    if (!lastName) {
        response.status(401).send({ error: "missing lastName" });
        return;
    }
    const trimedLastName = lastName.replace(/\s\s+/g, " ").trim();
    if (trimedLastName.length < 2) {
        response.status(401).send({ error: "firstname is to short after removing spaces" });
        return;
    }
    if (!middleName) {
        response.status(401).send({ error: "missing middleName" });
        return;
    }
    const trimedMiddleName = middleName.replace(/\s\s+/g, " ").trim();
    if (trimedMiddleName.length < 2) {
        response.status(401).send({ error: "middlename is to short after removing spaces" });
        return;
    }
    if (gender !== "male" && gender !== "female" && gender !== "other") {
        response.status(401).send({ error: "chose 'male', 'female' or 'other'" });
        return;
    }
    if (country.length > 100) {
        response.status(401).send({ error: "country is to long" });
        return;
    }
    if (/javascript\:/gi.test(profilePictureUrl) || /data\:/gi.test(profilePictureUrl)) {
        response.status(401).send({ error: "hacking disabled" });
        return;
    }
    if (profilePictureUrl.length > 250) {
        response.status(401).send({ error: "url is to long" });
    }
    /* TODO: Check if username already exists */
    pool_1.default.query("SELECT * FROM users WHERE username = $1", [username], (error, results) => {
        var _a;
        if (error) {
            response.status(401).send({ error: error.message });
            return;
        }
        if (((_a = results.rows[0]) === null || _a === void 0 ? void 0 : _a.username) === username) {
            response.status(401).send({ error: "This username is already taken" });
            return;
        }
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const hashedPassword = yield (0, hash_1.default)(password);
                /* TODO: Insert into database timestamp and user active false */
                pool_1.default.query("INSERT INTO users (phone, email, username, password, first_name, last_name, middle_name, gender, country, profile_picture_url, rol, verification_code, verification_code_time, is_active, is_reported, is_blocked, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)", [phone, email, username, hashedPassword, firstName, lastName, middleName, gender, country, profilePictureUrl, rol, verificationCode, new Date(), isActive, isReported, isBlocked, bio], (error, results) => {
                    if (error) {
                        console.log(error);
                        response.status(401).send({ error: error.message });
                        return;
                    }
                    const subject = "Relax Social Network - Verification Code";
                    const data = `Welcome to Relax.

Send us your verification code
${verificationCode}

Have a great stance.
`;
                    (0, sendMail_1.default)(email, subject, data);
                    response.status(200).send({ status: "Email send" });
                    return;
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    response.status(401).send({ error: error.message });
                }
                return;
            }
        }))();
    });
};
exports.signin = signin;
const verificateCode = (request, response) => {
    const { verificationCode } = request.body;
    if (!verificationCode) {
        response.status(401).send({ error: "You forgot to send verificationCode" });
        return;
    }
    if (!(verificationCode >= 0 && verificationCode < 1000000)) {
        response.status(401).send({ error: "verification code not valid" });
        return;
    }
    pool_1.default.query("SELECT * FROM users WHERE verification_code = $1", [verificationCode], (error, results) => {
        if (error) {
            response.status(401).send({ error: error.message });
            return;
        }
        if (results.rows[0]["is_active"] === true) {
            response.status(401).send({ error: "Account already activated" });
            return;
        }
        if (results.rows[0]["verification_code"]) {
            // ver_cod_time check
            if (results.rows[0]["verification_code_time"]) {
                const codeGeneratedAt = results.rows[0]["verification_code_time"];
                const timePassed = (+new Date() - +new Date(codeGeneratedAt));
                if (timePassed > 86400000) { // 1 day in milliseconds
                    response.status(401).send({ error: "Verification code expired. Request a new one" });
                    return;
                }
                if (verificationCode === results.rows[0]["verification_code"]) {
                    pool_1.default.query("UPDATE users SET is_active = $1 WHERE id = $2", [true, results.rows[0].id], (error, results) => {
                        if (error) {
                            response.status(401).send({ error: error.message });
                            return;
                        }
                        response.status(200).send({ status: "Account Activated" });
                        return;
                    });
                }
                else {
                    response.status(401).send({ error: "Verification_code is wrong" });
                    return;
                }
            }
            else {
                response.status(401).send({ error: "Verification time expiration not found in database" });
                return;
            }
        }
        else {
            response.status(401).send({ error: "Verification_code not found" });
            return;
        }
    });
};
exports.verificateCode = verificateCode;
const testUsernameExists = (request, response) => {
    var _a;
    if ((_a = request === null || request === void 0 ? void 0 : request.params) === null || _a === void 0 ? void 0 : _a.username) {
        pool_1.default.query("SELECT * FROM users WHERE username = $1", [request.params.username], (error, results) => {
            var _a;
            if (error) {
                response.status(401).send({ error: error.message });
                return;
            }
            if (((_a = results.rows[0]) === null || _a === void 0 ? void 0 : _a.username) === request.params.username) {
                response.status(200).send({ exists: true });
            }
            else {
                response.status(200).send({ exists: false });
            }
        });
    }
    else {
        response.status(401).send({ error: "Missing argument" });
    }
};
exports.testUsernameExists = testUsernameExists;
