import pool from "./auth/pool";
import { Request, Response } from "express";
import crypto from "crypto";

const getAPIDoc = (request: Request, response: Response) => {
  response.status(200).json({ info: "SNR API" });
}

const getUsers = (request: Request, response: Response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
}

const getUserById = (request: Request, response: Response) => {
  pool.query("SELECT * FROM users WHERE id = $1", [+request.params.id], (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).json(results.rows);
  });
}

const createUser = (request: Request, response: Response) => {
  const { name, email } = request.body;

  pool.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id", [name, email], (error, results) => {
    if (error) {
      throw error;
    }

    response.status(201).send(`User added with ID: ${results.rows[0].id}`);
  });
}

const updateUser = (request: Request, response: Response) => {
  const { name, email } = request.body

  pool.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, +request.params.id], (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).send(`User modified with ID: ${+request.params.id}`)
  });
}

const deleteUser = (request: Request, response: Response) => {
  pool.query("DELETE FROM users WHERE id = $1", [+request.params.id], (error, results) => {
    if (error) {
      throw error;
    }

    response.status(200).send(`User deleted with ID: ${+request.params.id}`)
  });
}

const authUser = (request: Request, response: Response) => {
  const { username, email, password } = request.body;

  if (!password) {
    //throw new Error("Password missing");
    response.status(400).json({ missing: "password"});
    return;
  }

  if (!username && !email) {
    //throw new Error("Username or Email missing");
    response.status(400).json({ missing: "username || email" });
    return;
  }


  if (username) {
    pool.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password], (error, results) => {
      if (error) {
        // throw Error;
	response.status(401).json({ error: "wrong credentials"});
	return;
      }

      // @ts-ignore
      if (results?.rows[0]?.username === username) {
	const token = crypto.randomBytes(64).toString("hex");
	pool.query("UPDATE users SET token = $1 WHERE username = $2 AND password = $3", [token, username, password], (error, results) => {
          if (error) {
            // throw Error;
	    response.status(200).json({ error: error.message });
	    return;
	  }
          response.status(200).json({ token: token });
	  return;
        });
      } else {
        response.status(401).json({ error: "wrong credentials"});
	return;
      }
    });
  } else /* email */ {
    pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password], (error, results) => {
      if (error) {
        // throw Error;
	response.status(401).json({ error: "wrong credentials"});
	return;
      }
      
      // @ts-ignore
      if (results?.rows[0]?.email === email) {
	const token = crypto.randomBytes(64).toString("hex");
        pool.query("UPDATE users SET token = $1 WHERE email = $2 AND password = $3", [token, email, password], (error, results) => {
          if (error) {
	    response.status(200).json({ error: error.message });
            return;
          }

          response.status(200).json({ token: token });
	  return;
        });
      } else {
        response.status(401).json({ error: "wrong credentials"});
	return;
      }
    }); 
  }
  return;
}

const updateUserBio = (request: Request, response: Response) => {
  const { bio } = request.body;
  pool.query("UPDATE users SET bio = $1 WHERE id = $2", [bio, +request.params.id], (error, results) => {
    if (error) {
      //throw error;
      console.log(error);
      return;
    }

    response.status(200).send(`Bio updated`);
  });
}



/* POSTS (PUBLICACIONES) */
const getUserPosts = (request: Request, response: Response) => {
  const userID = request?.headers["user_id"]; 

  if (userID) {
    pool.query("SELECT * FROM posts WHERE user_id = $1 ORDER BY post_id DESC", [userID], (error, results) => {
      if (error) {
	response.status(401).json({ error: error.message });
        return; 
      }

      response.status(200).json(results.rows);
    });
  }

};

const createUserPost = (request: Request, response: Response) => {
  const { title, post } = request.body;
  const userID = request?.headers["user_id"]; // check if not null

  if (userID) {
    pool.query("INSERT INTO posts (user_id, title, post) VALUES ($1, $2, $3)", [userID, title, post], (error, results) => {
      if (error) {
        console.log(error);
	return;
      }

      response.status(200).send(`Done`);
    });
  } else {

  }
}

const editUserPost = () => {};

const deleteUserPost = () => {};



export {
  getAPIDoc,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  authUser,

  updateUserBio,

  getUserPosts,
  createUserPost,
  editUserPost,
  deleteUserPost
}

