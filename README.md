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
CREATE TYPE gender AS ENUM ('male', 'female', 'other'); 

CREATE TYPE rol as ENUM ('admin', 'user');

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  phone VARCHAR(16),
  rol rol,
  email VARCHAR(60),
  username VARCHAR(100),
  password VARCHAR(255),
  token VARCHAR(255),
  first_name VARCHAR(20),
  last_name VARCHAR(20),
  middle_name VARCHAR(20),
  gender gender,
  country VARCHAR(255),
  profile_picture_url VARCHAR(255),
  verification_code CHAR(6),
  is_active BOOL,
  is_reported BOOL,
  is_blocked BOOL,
  bio VARCHAR(255),
  created_at DATE default CURRENT_DATE,
  updated_at DATE
);
```  
+ Create 2 test users  
```
INSERT INTO users (
  phone,
  rol,
  email,
  username,
  password,
  token,
  first_name,
  last_name,
  middle_name,
  gender,
  country,
  profile_picture_url, 
  verification_code,
  is_active,
  is_reported,
  is_blocked,
  bio,
  updated_at
) VALUES (
  '555-555-555',
  'admin',
  'stringmanolo@example.com',
  'StringManolo',
  '123456',
  'null',
  'Manolo',
  'Javascript',
  'Developer',
  'male',
  'spain',
  'https://google.com/favicon.ico',
  '625625',
  '1',
  '0',
  '0',
  'Hello :D',
  CURRENT_DATE
), (
  '555-555-556',
  'user',
  'alice@example.com',
  'Aliii',
  '123456',
  'null',
  'Alice',
  'Dummy',
  'User',
  'female',
  'france',
  'https://google.com/favicon.ico',
  '123123',
  '1',
  '0',
  '0',
  'Ey!',
  CURRENT_DATE
);
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


