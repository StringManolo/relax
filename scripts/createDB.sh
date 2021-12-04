psql -d postgres -c '

  CREATE ROLE snradmin WITH LOGIN PASSWORD '"'"'tmp'"'"';

  ALTER ROLE snradmin CREATEDB;

' > /dev/null && psql -d postgres -U snradmin -c '

  CREATE DATABASE snr;

' > /dev/null && psql -d snr -U snradmin -c '

CREATE TYPE gender AS ENUM ('"'"'male'"'"', '"'"'female'"'"', '"'"'other'"'"'); 

CREATE TYPE rol as ENUM ('"'"'admin'"'"', '"'"'user'"'"');


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
  verification_code_time TIMESTAMPTZ,
  is_active BOOL,
  is_reported BOOL,
  is_blocked BOOL,
  bio VARCHAR(255),
  created_at DATE default CURRENT_DATE,
  updated_at DATE
);


CREATE TABLE posts (
  post_id SERIAL PRIMARY KEY,
  user_id INT,
  title VARCHAR(120),
  post VARCHAR(500),
  timestamp TIMESTAMP default CURRENT_TIMESTAMP,
  CONSTRAINT fk_id
    FOREIGN KEY(user_id)
      REFERENCES users(ID)
);


CREATE TABLE subscribers (
  suscribers_id SERIAL PRIMARY KEY,
  user_id INT,
  subscriber_user_id INT,
  subscriber_first_name VARCHAR(20),
  subscriber_username VARCHAR(100),
  CONSTRAINT fk_id
    FOREIGN KEY(user_id)
      REFERENCES users(ID)
);


CREATE TABLE friends (
  friends_id SERIAL PRIMARY KEY,
  user_id INT,
  friend_user_id INT,
  friend_first_name VARCHAR(20),
  friend_username VARCHAR(100),
  CONSTRAINT fk_id
    FOREIGN KEY(user_id)
      REFERENCES users(ID)
);


CREATE TABLE groups (
  group_id SERIAL PRIMARY KEY,
  creator_id INT,
  title VARCHAR(120),
  bio VARCHAR(255),
  timestamp TIMESTAMP default CURRENT_TIMESTAMP,
  CONSTRAINT fk_id
    FOREIGN KEY(creator_id)
      REFERENCES users(ID)
);


CREATE TABLE groupMembers (
  group_id INT,
  user_id INT,
  CONSTRAINT fk_user_id
    FOREIGN KEY(user_id)
      REFERENCES users(ID),
  CONSTRAINT fk_group_id
    FOREIGN KEY(group_id)
      REFERENCES groups(group_id)
);


' > dev/null ;
