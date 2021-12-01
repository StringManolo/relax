"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const child_process_1 = __importDefault(require("child_process"));
const run = (args) => {
    let res = child_process_1.default.execSync(args).toString();
    return res;
};
const open = (filename, mode) => {
    const fd = {};
    try {
        fd.internalFd = fs_1.default.openSync(filename, mode);
        fd.read = (buffer, position, len) => fs_1.default.readSync(fd.internalFd, buffer, position, len, null);
        fd.puts = (str) => fs_1.default.writeSync(fd.internalFd, str);
        fd.close = () => fs_1.default.closeSync(fd.internalFd);
        return fd;
    }
    catch (err) {
        console.log("open " + err);
        return fd;
    }
};
const output = (text) => {
    const fd = open("/dev/stdout", "w");
    fd.puts(text);
    fd.close();
};
const input = () => {
    let rtnval = "";
    let buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
    for (;;) {
        fs_1.default.readSync(0, buffer, 0, 1, null);
        if (buffer[0] === 10) {
            break;
        }
        else if (buffer[0] !== 13) {
            rtnval += new String(buffer);
        }
    }
    return rtnval;
};
const ask = (question) => {
    output(question);
    return input();
};
const askSignin = () => {
    // const { phone, email, username, password, firstName, lastName, middleName, gender, country, profilePictureUrl } = 
    const credentials = {
        phone: +ask("Phone -> "),
        email: ask("Email -> "),
        username: ask("Username -> "),
        password: ask("Password -> "),
        firstName: ask("First Name -> "),
        lastName: ask("Last Name -> "),
        middleName: ask("Middle Name -> "),
        gender: ask("Gender (male,female,other) -> "),
        country: ask("Country -> "),
        profilePictureUrl: ask("Profile picture url -> ")
    };
    // maybe validate here too. To avoid useless requests
    return credentials;
};
const signin = (credentials) => {
    const { phone, email, username, password, firstName, lastName, middleName, gender, country, profilePictureUrl } = credentials;
    const response = run(`curl --silent http://localhost:3000/signin -d 'phone=${phone}&email=${email}&username=${username}&password=${password}&firstName=${firstName}&lastName=${lastName}&middleName=${middleName}&gender=${gender}&country=${country}&profilePictureUrl=${profilePictureUrl}'`);
    console.log("\n" + response);
};
const login = (usernameOrEmail, password) => {
    let response = "";
    if (/@/g.test(usernameOrEmail)) {
        response = run(`curl --silent http://localhost:3000/auth -d 'email=${usernameOrEmail}&password=${password}'`);
    }
    else {
        response = run(`curl --silent http://localhost:3000/auth -d 'username=${usernameOrEmail}&password=${password}'`);
    }
    console.log(response);
};
const verification = (verificationCode) => {
    const response = run(`curl --silent http://localhost:3000/verification -d "verificationCode=${verificationCode}"`);
    console.log(response);
};
/*
 app.get("/", getAPIDoc); // show how to use the API

app.post("/signin", signin); // register your account
app.post("/verification", verificateCode);
// TODO: validate verification code endpoint
app.post("/auth", authUser); // request your token using credentials

app.use(authMiddleware); // request token for next API endpoints

app.get("/users", getUsers);
app.get("/users/:id", getUserById);
app.post("/users", createUser); // test only
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);
app.put("/users/:id/:bio", updateUserBio);

app.get("/users/:id/posts", getUserPosts); // Get all posts from an user
app.post("/users/post", createUserPost); // Create a post from current user
app.put("/users/post", editUserPost); // Edit a post from current user
app.delete("/users/post", deleteUserPost); // Delete a post from current user;

*/
const parseArguments = () => {
    const cli = {};
    for (let i = 0; i < process.argv.length; ++i) {
        const current = process.argv[i];
        const next = process.argv[+i + 1];
        switch (current) {
            case "signin":
            case "sign":
                cli.signin = true;
                break;
            case "verification":
                cli.verification = true;
                break;
            case "auth":
            case "login":
                cli.login = true;
                break;
            case "h":
            case "help":
            case "Help":
            case "-h":
            case "--help":
                console.log(`Help Menu:

signin            Creates an account
verification      Activate an account
login             Log into an account

Usage:
  node cli-client.js sigin|verification|login
`);
                process.exit(0);
                break;
        }
    }
    return cli;
};
/* <main> */
const cli = parseArguments();
if (cli === null || cli === void 0 ? void 0 : cli.signin) {
    const data = askSignin();
    signin(data);
}
else if (cli === null || cli === void 0 ? void 0 : cli.login) {
    const userOrEmail = +ask("1 - Login Username\n2 - Login Email\nYour choice -> ");
    if (userOrEmail === 1) {
        login(ask("Username -> "), ask("Password -> "));
    }
    else {
        login(ask("Email -> "), ask("Password -> "));
    }
}
else if (cli === null || cli === void 0 ? void 0 : cli.verification) {
    const verificationCode = +ask("Your Verification Code -> ");
    verification(verificationCode);
}
/* </main> */
