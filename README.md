# Relax

#### npm scripts

| Command | Description |
| --- | --- |
| npm install | Install all the dependencies |
| npm run | Show this list of npm scripts |
| npm run compile | Compile the typescript project without credentials |
| npm run compile-dev | Compile the typescript project to be runnable |
| npm run push "Commit message" | Git add, git commit and git push without credentials (make sure you compiled without credentials just right before) |
| npm start | Create postgresql database, user, roles and tables and/or start the services |
| npm run start-node | Start node service |
| npm stop | Stop Postgresql and Node services |
| npm run showPgLogs | Show service logs |
| npm run deletePgLogs | Delete service logs |
| npm run delete | Delete the database |
| npm run test-signin | Create a default account and show results |
| npm run test-login | Try to log with default account and show results |
| npm run test-verification | Try to submit default verification_code and show results |
| npm run cli | Run a cli client (show help) |
| npm run cli-signin | Create an account using the terminal, an email will be sent (for debug output also shown to console if you start node running npm run start-node) |
| npm run cli-verification | Verificate an account using the terminal |
| npm run cli-login | Log into an account using the terminal |
| npm run cli-username | Test if an username is available using the terminal |
| npm run cli-createPost | Create a user post using the terminal |
| npm run cli-setBio | Set bio (a short personal description of the user) using the terminal |
| npm run cli-getProfile | Show user info (not including credentials and metadata) and posts using the terminal |
| npm run cli-search | Search a pattern in the database using the terminal |
| npm run cli-showProfile | Same as getProfile but by username (other users), using the terminal |
| npm run cli-addFriend | Add a user to your friend list using the terminal |
| npm run edit-server | Edit the server typescript file using vim |
| npm run edit-queries | Edit the queries typescript file using vim |
| npm run edit-cli | Edit the cli typescript file using vim |
| npm run edit-todo | Edit the TODO markdown file using vim |
| npm run edit-readme | Edit the README markdown file using vim |
| npm run netcat | Start a ncat (the netcat from nmap) binded to port 3000 to debug front-end/cli | 
| npm run test | Test all the project (not implemented yet) |
