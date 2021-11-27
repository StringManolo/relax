# Relax

#### Create a role in postgresql, a database and a table with users
+ Create the db and/or start the service  
```npm start```  
+ Connect to the db  
```psql postgres```  
+ Create a role  
```CREATE ROLE stringmanolo WITH LOGIN PASSWORD 'tmp';```  
+ Allow new role to create new db  
```ALTER ROLE stringmanolo CREATEDB;```  
+ Disconect from postgres db  
```\q```  
+ Connect to the new role 
```psql -d postgres -U stringmanolo```  
+ Create the new database  
```CREATE DATABASE snr;```  
+ Connect to the db  
```\c snr```  
+ Create a table for users
```
CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(60)
);
```  
+ Create 2 test users  
```
INSERT INTO users (name,email) 
  VALUES ('stringmanolo', 'stringmanolo@example.com'), ('andy', 'andy@example.com');
```


#### npm scripts

| Command | Description |
| --- | --- |
| npm run compile | Compile the typescript project |
| npm run push "Commit message" | Git add, git commit and git push |
| npm start | Create Postgresql and/or start the service |
| npm stop | Stop Postgresql service |
| npm run showPgLogs | Show service logs |
| npm run deletePgLogs | Delete service logs |
| npm run delete | Delete the database |
| npm run test | Test the project (not implemented yet) |


