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
const encodeComponent = (component) => {
    while (/\'/g.test(component)) {
        component = component.replace(/\'/g, "%27");
    }
    return encodeURIComponent(component);
};
const decodeComponent = (component) => {
    while (/\%27/g.test(component)) {
        component = component.replace(/\%27/g, "'");
    }
    return decodeURIComponent(component);
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
    const response = run(`curl --silent http://localhost:3000/signin -d 'phone=${phone}&email=${encodeComponent(email)}&username=${encodeComponent(username)}&password=${encodeComponent(password)}&firstName=${encodeComponent(firstName)}&lastName=${encodeComponent(lastName)}&middleName=${encodeComponent(middleName)}&gender=${encodeComponent(gender)}&country=${encodeComponent(country)}&profilePictureUrl=${encodeComponent(profilePictureUrl)}'`);
    // if response is json:
    try {
        const parsed = JSON.parse(response);
        if (parsed === null || parsed === void 0 ? void 0 : parsed.error) {
            console.log("\nError: " + parsed.error);
        }
        else if (parsed === null || parsed === void 0 ? void 0 : parsed.status) {
            console.log("\n" + parsed.status);
        }
        else {
            console.log("\n" + parsed);
        }
        return undefined;
    }
    catch (error) {
    }
    // if response is plain/text:
    console.log("\n" + response);
    return undefined;
};
const login = (usernameOrEmail, password) => {
    let response = "";
    if (/@/g.test(usernameOrEmail)) {
        response = run(`curl --silent http://localhost:3000/auth -d 'email=${encodeComponent(usernameOrEmail)}&password=${encodeComponent(password)}'`);
        try {
            const parsed = JSON.parse(response);
            if (parsed === null || parsed === void 0 ? void 0 : parsed.error) {
                console.log("\nError: " + parsed.error);
            }
            else if (parsed === null || parsed === void 0 ? void 0 : parsed.status) {
                console.log("\n" + parsed.status);
            }
            else if (parsed === null || parsed === void 0 ? void 0 : parsed.token) {
                console.log("\nToken: " + parsed.token);
            }
            else {
                console.log("\n" + parsed);
            }
            return undefined;
        }
        catch (error) {
        }
    }
    else {
        response = run(`curl --silent http://localhost:3000/auth -d 'username=${encodeComponent(usernameOrEmail)}&password=${encodeComponent(password)}'`);
        try {
            const parsed = JSON.parse(response);
            if (parsed === null || parsed === void 0 ? void 0 : parsed.error) {
                console.log("\nError: " + parsed.error);
            }
            else if (parsed === null || parsed === void 0 ? void 0 : parsed.status) {
                console.log("\n" + parsed.status);
            }
            else if (parsed === null || parsed === void 0 ? void 0 : parsed.token) {
                console.log("\nToken: " + parsed.token);
            }
            else {
                console.log("\n" + parsed);
            }
            return undefined;
        }
        catch (error) {
        }
    }
    console.log("\n" + response);
    return undefined;
};
const verification = (verificationCode) => {
    const response = run(`curl --silent http://localhost:3000/verification -d "verificationCode=${verificationCode}"`);
    try {
        const parsed = JSON.parse(response);
        if (parsed === null || parsed === void 0 ? void 0 : parsed.error) {
            console.log("\nError: " + parsed.error);
        }
        else if (parsed === null || parsed === void 0 ? void 0 : parsed.status) {
            console.log("\n" + parsed.status);
        }
        else {
            console.log("\n" + parsed);
        }
        return undefined;
    }
    catch (error) {
    }
    console.log("\n" + response);
    return undefined;
};
const testUsername = (username) => {
    const response = run(`curl --silent 'http://localhost:3000/exists/${encodeComponent(username)}'`);
    console.log(response);
};
const createPost = (title, post, token) => {
    const response = run(`curl --silent http://localhost:3000/users/post/ -d 'title=${encodeComponent(title)}&post=${encodeComponent(post)}' -H 'Authorization: ${token}'`);
    console.log(response);
};
const setBio = (bio, token) => {
    const response = run(`curl --silent http://localhost:3000/users/bio -d 'bio=${encodeComponent(bio)}' -X PUT -H 'Authorization: ${token}'`);
    console.log(response);
};
const getProfile = (token) => {
    const responseProfile = run(`curl --silent http://localhost:3000/profile -H 'Authorization: ${token}'`);
    const { id, phone, rol, email, username, first_name, last_name, middle_name, gender, country, profile_picture_url, is_reported, is_blocked, bio, created_at } = JSON.parse(responseProfile);
    const responsePosts = run(`curl --silent http://localhost:3000/users/posts -H 'Authorization: ${token}'`);
    const parsedPosts = JSON.parse(responsePosts);
    let posts = [];
    for (let i = 0; i < parsedPosts.length; ++i) {
        const { title, post, timestamp } = parsedPosts[i];
        posts.push(`    ${decodeComponent(title)}
      ${decodeComponent(post)}

      published: ${timestamp.replace("T", " ").substr(0, timestamp.length - 5)}

`);
    }
    console.log(`
	
@${username} 

    picture: ${decodeComponent(profile_picture_url)}
    bio: ${decodeComponent(bio)} 

    name: ${decodeComponent(first_name)} ${decodeComponent(middle_name)} ${decodeComponent(last_name)}
    gender: ${decodeComponent(gender)}
    country: ${decodeComponent(country)}
    created: ${decodeComponent(created_at.split("T")[0])}

Posts:
${decodeComponent(posts.length > 1 ? posts.join("") : posts.toString())}
`);
    // add posts here
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
            case "testUsername":
            case "username":
                cli.username = true;
                break;
            case "createPost":
            case "createpost":
            case "CreatePost":
            case "create-post":
                cli.createPost = true;
                break;
            case "bio":
            case "setBio":
            case "setbio":
            case "updateBio":
            case "updatebio":
                cli.setBio = true;
                break;
            case "profile":
            case "getProfile":
            case "getprofile":
                cli.getProfile = true;
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
username          Test if username is already taken
createPost        Create a new post
setBio            Set user bio
getProfile        Get your own profile

Usage:
  node cli-client.js sigin|verification|login|username|createPost|setBio|getProfile
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
else if (cli === null || cli === void 0 ? void 0 : cli.username) {
    const username = ask("Username -> ");
    testUsername(username);
}
else if (cli === null || cli === void 0 ? void 0 : cli.createPost) {
    const token = ask("Token -> ");
    const title = ask("Title -> ");
    const post = ask("Post -> ");
    createPost(title, post, token);
}
else if (cli === null || cli === void 0 ? void 0 : cli.setBio) {
    const token = ask("Token -> ");
    const bio = ask("Bio -> ");
    setBio(bio, token);
}
else if (cli === null || cli === void 0 ? void 0 : cli.getProfile) {
    const token = ask("Token -> ");
    getProfile(token);
}
/* </main> */
