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
    try {
        const parsed = JSON.parse(response);
        if ((parsed === null || parsed === void 0 ? void 0 : parsed.exists) === true) {
            console.log("\n" + username + " already taken");
        }
        else if ((parsed === null || parsed === void 0 ? void 0 : parsed.exists) === false) {
            console.log("\n" + username + " is available");
        }
        else if (parsed === null || parsed === void 0 ? void 0 : parsed.error) {
            console.log("\nError: " + parsed.error);
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
const createPost = (title, post, token) => {
    const response = run(`curl --silent http://localhost:3000/users/post/ -d 'title=${encodeComponent(title)}&post=${encodeComponent(post)}' -H 'Authorization: ${token}'`);
    try {
        const parsed = JSON.parse(response);
        if (parsed === null || parsed === void 0 ? void 0 : parsed.status) {
            console.log("\n" + parsed.status);
        }
        else if (parsed === null || parsed === void 0 ? void 0 : parsed.error) {
            console.log("\nError: " + parsed.error);
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
const setBio = (bio, token) => {
    const response = run(`curl --silent http://localhost:3000/users/bio -d 'bio=${encodeComponent(bio)}' -X POST -H 'Authorization: ${token}'`);
    try {
        const parsed = JSON.parse(response);
        if (parsed === null || parsed === void 0 ? void 0 : parsed.status) {
            console.log("\n" + parsed.status);
        }
        else if (parsed === null || parsed === void 0 ? void 0 : parsed.error) {
            console.log("\n" + parsed.error);
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
const getProfile = (token) => {
    const responseProfile = run(`curl --silent http://localhost:3000/profile -H 'Authorization: ${token}'`);
    const { id, phone, rol, email, username, first_name, last_name, middle_name, gender, country, profile_picture_url, is_reported, is_blocked, bio, created_at } = JSON.parse(responseProfile);
    if (!username) {
        const aux = JSON.parse(responseProfile);
        if (aux === null || aux === void 0 ? void 0 : aux.error) {
            console.log("\nError: " + aux.error);
            return;
        }
        else {
            console.log("\nError: Unable to retrieve user data");
            return;
        }
    }
    const responsePosts = run(`curl --silent http://localhost:3000/posts -H 'Authorization: ${token}'`);
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
	
${decodeComponent(first_name)} @${decodeComponent(username)} 

    picture: ${decodeComponent(profile_picture_url)}
    bio: ${decodeComponent(bio)} 

    name: ${decodeComponent(first_name)} ${decodeComponent(middle_name)} ${decodeComponent(last_name)}
    gender: ${decodeComponent(gender)}
    country: ${decodeComponent(country)}
    created: ${decodeComponent(created_at.split("T")[0])}

Posts:
${decodeComponent(posts.length > 1 ? posts.join("") : posts.toString())}
`);
};
const showProfile = (usernameParam, token) => {
    const responseProfile = run(`curl --silent 'http://localhost:3000/users/username/${encodeComponent(usernameParam)}' -H 'Authorization: ${token}'`);
    const { id, phone, rol, email, username, first_name, last_name, middle_name, gender, country, profile_picture_url, is_reported, is_blocked, bio, created_at } = JSON.parse(responseProfile);
    if (!username) {
        const aux = JSON.parse(responseProfile);
        if (aux === null || aux === void 0 ? void 0 : aux.error) {
            console.log("\nError: " + aux.error);
            return;
        }
        else {
            console.log("\nError: Unable to retrieve user data");
            return;
        }
    }
    const responsePosts = run(`curl --silent 'http://localhost:3000/posts/username/${encodeComponent(usernameParam)}' -H 'Authorization: ${token}'`);
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

${decodeComponent(first_name)} @${decodeComponent(username)}

    picture: ${decodeComponent(profile_picture_url)}
    bio: ${decodeComponent(bio)}

    name: ${decodeComponent(first_name)} ${decodeComponent(middle_name)} ${decodeComponent(last_name)}
    gender: ${decodeComponent(gender)}
    country: ${decodeComponent(country)}
    created: ${decodeComponent(created_at.split("T")[0])}

Posts:
${decodeComponent(posts.length > 1 ? posts.join("") : posts.toString())}
`);
};
const search = (searchPattern, token) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const response = run(`curl --silent 'http://localhost:3000/search/${encodeComponent(searchPattern)}' -H 'Authorization: ${token}'`);
    try {
        const parsed = JSON.parse(response);
        if (parsed === null || parsed === void 0 ? void 0 : parsed.error) {
            console.log("\nError: " + parsed.error);
            return undefined;
        }
        else {
            let aux = "Results:";
            if (parsed === null || parsed === void 0 ? void 0 : parsed.users) {
                if (Array.isArray(parsed.users)) {
                    for (let i = 0; i < parsed.users.length; ++i) {
                        aux += `\n + ${decodeComponent((_a = parsed.users[i]) === null || _a === void 0 ? void 0 : _a.first_name)} @${decodeComponent((_b = parsed.users[i]) === null || _b === void 0 ? void 0 : _b.username)}`;
                    }
                }
                else {
                    aux += `\n + ${decodeComponent((_c = parsed.users) === null || _c === void 0 ? void 0 : _c.first_name)} @${decodeComponent((_d = parsed.users) === null || _d === void 0 ? void 0 : _d.username)}`;
                }
            }
            if (parsed === null || parsed === void 0 ? void 0 : parsed.posts) {
                if (Array.isArray(parsed.posts)) {
                    for (let i = 0; i < parsed.posts.length; ++i) {
                        aux += `\n + ( ${decodeComponent((_e = parsed.posts[i]) === null || _e === void 0 ? void 0 : _e.title)} ) `;
                    }
                }
                else {
                    aux += `\n + ( ${decodeComponent((_f = parsed.posts) === null || _f === void 0 ? void 0 : _f.title)} ) `;
                }
            }
            if (parsed === null || parsed === void 0 ? void 0 : parsed.groups) {
                if (Array.isArray(parsed.groups)) {
                    for (let i = 0; i < parsed.groups.length; ++i) {
                        aux += `\n + ${decodeComponent((_g = parsed.groups[i]) === null || _g === void 0 ? void 0 : _g.title)}: ${decodeComponent((_h = parsed.groups[i]) === null || _h === void 0 ? void 0 : _h.bio.substr(0, 20))}... `;
                    }
                }
                else {
                    aux += `\n + ${decodeComponent((_j = parsed.groups) === null || _j === void 0 ? void 0 : _j.title)}: ${decodeComponent((_k = parsed.groups) === null || _k === void 0 ? void 0 : _k.title.substr(0, 20))}... `;
                }
            }
            if (aux.length > 9) {
                console.log("\n" + aux);
                return undefined;
            }
        }
    }
    catch (error) {
    }
    console.log("\n" + decodeComponent(response));
    return undefined;
};
const addFriend = (username, token) => {
    const response = run(`curl --silent 'http://localhost:3000/friends/username' -d 'username=${encodeComponent(username)}' -H 'Authorization: ${token}'`);
    try {
        const parsed = JSON.parse(response);
        if (parsed === null || parsed === void 0 ? void 0 : parsed.status) {
            console.log("\n" + parsed.status);
        }
        else if (parsed === null || parsed === void 0 ? void 0 : parsed.error) {
            console.log("\nError: " + parsed.error);
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
const getFriends = (token) => {
    const response = run(`curl --silent 'http://localhost:3000/friends/' -H 'Authorization: ${token}'`);
    try {
        const parsed = JSON.parse(response);
        if (parsed) {
            if (Array.isArray(parsed)) {
                for (let i = 0; i < parsed.length; ++i) {
                    console.log("\n@" + parsed[i].friend_username);
                }
            }
            else {
                console.log("\n@" + parsed.friend_username);
            }
        }
        else if (parsed.error) {
            console.log("\nError: " + parsed.error);
        }
        return undefined;
    }
    catch (error) {
    }
    console.log("\n" + response);
    return undefined;
};
const testFriend = (token, friend) => {
    const response = run(`curl --silent 'http://localhost:3000/isFriend/${friend}' -H 'Authorization: ${token}'`);
    try {
        const parsed = JSON.parse(response);
        if ((parsed === null || parsed === void 0 ? void 0 : parsed.exists) === true) {
            console.log("\n" + friend + " already a friend");
        }
        else if ((parsed === null || parsed === void 0 ? void 0 : parsed.exists) === false) {
            console.log("\n" + friend + " is not a friend");
        }
        else if (parsed === null || parsed === void 0 ? void 0 : parsed.error) {
            console.log("\nError: " + parsed.error);
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
            case "showProfile":
            case "showprofile":
                cli.showProfile = true;
                break;
            case "search":
            case "find":
                cli.search = true;
                break;
            case "friends":
            case "getFriend":
            case "getFriends":
                cli.friends = true;
                break;
            case "addFriend":
            case "addfriend":
                cli.addFriend = true;
                break;
            case "friend":
            case "Friend":
                cli.friend = true;
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
search            Search users and groups by name
showProfile       Get profile by username
getFriends        Get a list of friends
addFriend         Add a user to your list of friends
friend            Test if user is already a friend

Usage:
  node cli-client.js sigin|verification|login|username|createPost|setBio|getProfile|search|showProfile|getFriends|addFriend|friend
`);
                process.exit(0);
                break;
        }
    }
    return cli;
};
// TODO: GET USER BY USERNAME
/* <main> */
const cli = parseArguments();
try { // catch connection errors
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
    else if (cli === null || cli === void 0 ? void 0 : cli.search) {
        const token = ask("Token -> ");
        const searchPattern = ask("Search -> ");
        search(searchPattern, token);
    }
    else if (cli === null || cli === void 0 ? void 0 : cli.showProfile) {
        const token = ask("Token -> ");
        const username = ask("Username -> @");
        showProfile(username, token);
    }
    else if (cli === null || cli === void 0 ? void 0 : cli.addFriend) {
        const token = ask("Token -> ");
        const username = ask("Username -> @");
        addFriend(username, token);
    }
    else if (cli === null || cli === void 0 ? void 0 : cli.friends) {
        const token = ask("Token -> ");
        getFriends(token);
    }
    else if (cli.friend) {
        const token = ask("Token -> ");
        const friend = ask("Friend Username -> @");
        testFriend(token, friend);
    }
    else {
        console.log("\nusage: node cli-client.js help");
    }
}
catch (error) {
    if (error instanceof Error) {
        console.log("\nError:\n\n" + error.message + "\n\nMake sure the server is binded to localhost:3000\nhint: $ npm stop; npm start");
    }
}
/* </main> */
