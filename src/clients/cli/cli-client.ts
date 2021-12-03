import fs from "fs";
import exec from "child_process";


// TODO: ADD OPTION TO CHOSE ENDPOINT (DEFUALT https://localhost:3000)


interface FileDescriptor {
  internalFd: number,
  read(buffer: Buffer, position: number, len: number): number,
  puts(str: string): number,
  close(): void
}

interface Cli {
  signin?: boolean,
  login?: boolean,
  verification?: boolean,
  username?: boolean,
  createPost?: boolean,
  setBio?: boolean
}

const run = (args: string): string => {
  let res = exec.execSync(args).toString()
  return res;
};

const open = (filename: string, mode: string) => {
  const fd: FileDescriptor = {} as any;
  try {
    fd.internalFd = fs.openSync(filename, mode)
    fd.read = (buffer, position, len) => fs.readSync(fd.internalFd, buffer, position, len, null);
    fd.puts = (str) => fs.writeSync(fd.internalFd, str);
    fd.close = () => fs.closeSync(fd.internalFd);
    return fd;
  } catch(err) {
    console.log("open " + err);
    return fd;
  }
}

const output = (text: string) => {
  const fd = open("/dev/stdout", "w");
  fd.puts(text);
  fd.close();
}

const input = (): string => {
  let rtnval = "";
  let buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
  for(;;) {
    fs.readSync(0, buffer, 0, 1, null);
    if(buffer[0] === 10) {
      break;
    } else if(buffer[0] !== 13) {
      rtnval += new String(buffer);
    }
  }
  return rtnval;
}

const ask = (question: string): string => {
  output(question);
  return input();
}



interface SigninCredentials {
  phone: number,
  email: string,
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  middleName: string,
  gender: string,
  country: string,
  profilePictureUrl: string
}

const askSignin = () => {
  // const { phone, email, username, password, firstName, lastName, middleName, gender, country, profilePictureUrl } = 
  const credentials: SigninCredentials = {
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
}

const signin = (credentials: SigninCredentials) => {
  const { phone, email, username, password, firstName, lastName, middleName, gender, country, profilePictureUrl } = credentials;
  const response = run(`curl --silent http://localhost:3000/signin -d 'phone=${phone}&email=${escape(email)}&username=${escape(username)}&password=${escape(password)}&firstName=${escape(firstName)}&lastName=${escape(lastName)}&middleName=${escape(middleName)}&gender=${escape(gender)}&country=${escape(country)}&profilePictureUrl=${escape(profilePictureUrl)}'`);
  console.log("\n" + response);
}

const login = (usernameOrEmail: string, password: string) => {
  let response = "";
  if (/@/g.test(usernameOrEmail)) {
    response = run(`curl --silent http://localhost:3000/auth -d 'email=${escape(usernameOrEmail)}&password=${escape(password)}'`);
  } else {
    response = run(`curl --silent http://localhost:3000/auth -d 'username=${escape(usernameOrEmail)}&password=${escape(password)}'`);
  }
  console.log(response);
}

const verification = (verificationCode: number) => {
  const response = run(`curl --silent http://localhost:3000/verification -d "verificationCode=${verificationCode}"`);
  console.log(response);
}

const testUsername = (username: string) => {
  const response = run(`curl --silent 'http://localhost:3000/exists/${escape(username)}'`);
  console.log(response);
}


const createPost = (title: string, post: string, token: string) => {
  const response = run(`curl --silent http://localhost:3000/users/post/ -d 'title=${escape(title)}&post=${escape(post)}' -H 'Authorization: ${token}'`);
  console.log(response);
}

const setBio = (bio: string, token: string) => {
  const response = run(`curl --silent http://localhost:3000/users/bio -d 'bio=${escape(bio)}' -X PUT -H 'Authorization: ${token}'`);
  console.log(response);
}

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

const parseArguments = (): Cli => {
  const cli: Cli = {} as any;
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

Usage:
  node cli-client.js sigin|verification|login|username|createPost|setBio
`);
        process.exit(0);
      break;


    }
  }
  return cli;
}





/* <main> */
const cli = parseArguments();

if (cli?.signin) {
  const data = askSignin();
  signin(data);
} else if (cli?.login) {
  const userOrEmail = +ask("1 - Login Username\n2 - Login Email\nYour choice -> ");
  if (userOrEmail === 1) {
    login(ask("Username -> "), ask("Password -> "));
  } else {
    login(ask("Email -> "), ask("Password -> "));
  }
} else if (cli?.verification) {
  const verificationCode = +ask("Your Verification Code -> ");
  verification(verificationCode);
} else if (cli?.username) {
  const username = ask("Username -> ");
  testUsername(username);
} else if (cli?.createPost) {
  const token = ask("Token -> ");
  const title = ask("Title -> ");
  const post = ask("Post -> ");
  createPost(title, post, token);
} else if (cli?.setBio) {
  const token = ask("Token -> ");
  const bio = ask("Bio -> ");
  setBio(bio, token);
}



/* </main> */
