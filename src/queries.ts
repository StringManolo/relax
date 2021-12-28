import pool from "./auth/pool";
import sendMail from "./auth/sendMail";
import hash from "./auth/hash";
import hashWithIV from "./auth/hashWithIV";
import { Request, Response } from "express";
import crypto from "crypto";

const getAPIDoc = (request: Request, response: Response) => {
  response.status(200).json({ info: "SNR API" });
}

const getUsers = (request: Request, response: Response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message });
      return;
    }

    response.status(200).json(results?.rows);
  });
}

const getUserById = (request: Request, response: Response) => {
  pool.query("SELECT * FROM users WHERE id = $1", [+request?.params?.id], (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message });
      return;
    }

    response.status(200).json(results?.rows);
  });
}

const createUser = (request: Request, response: Response) => {
  const { name, email } = request.body;

  pool.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id", [name, email], (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message });
      return;
    }

    response.status(201).send(`User added with ID: ${results?.rows[0]?.id}`);
  });
}

const updateUser = (request: Request, response: Response) => {
  const { name, email } = request.body

  pool.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, +request.params.id], (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message });
      return;
    }

    response.status(200).send(`User modified with ID: ${+request?.params?.id}`)
  });
}

const deleteUser = (request: Request, response: Response) => {
  pool.query("DELETE FROM users WHERE id = $1", [+request?.params?.id], (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message });
      return;
    }

    response.status(200).send(`User deleted with ID: ${+request?.params?.id}`)
  });
}

const authUser = (request: Request, response: Response) => {
  const { username, email, password } = request.body;

  if (!password) {
    //throw new Error("Password missing");
    response.status(401).json({ missing: "password"});
    return;
  }

  if (!username && !email) {
    //throw new Error("Username or Email missing");
    response.status(401).json({ missing: "username || email" });
    return;
  }


  if (username) {
    pool.query("SELECT * FROM users WHERE username = $1"/* AND password = $2"*/, [username/*, password*/], (error, results) => {
      if (error) {
	response.status(401).json({ error: error.message });
	return;
      }

      // @ts-ignore
      if (results?.rows[0]?.username === username) {
	if (results?.rows[0]?.is_active !== true) {
          response.status(401).json({ error: "Account not activated yet. Check your email for verification code"});
	  return;
	}

	const token = crypto.randomBytes(64).toString("hex");

        // get IV from database
	pool.query("SELECT * FROM users WHERE username = $1", [username], (error, results) => {
          if (error) {
            response.status(401).json({ error: error.message });
	    return;
	  }

          let iv = "";

          if (results?.rows[0]?.password) {
	    if (/\:/.test(results.rows[0].password)) {
              iv = results.rows[0].password.split(":")[0];
	    } else {
              response.status(401).json({ error: "Unable to retrieve IV" });
	    }
          } else {
            response.status(401).json({ error: "Unable to retrieve IV" });
	    return;
	  }
        
	  (async() => {
            const userHashedPassword = await hashWithIV(password, iv);
            if (userHashedPassword === results?.rows[0]?.password) {
              pool.query("UPDATE users SET token = $1 WHERE username = $2 AND password = $3", [token, username, userHashedPassword], (error, results) => {
                if (error) {
	          response.status(401).json({ error: error.message });
	          return;
	        }

		response.cookie("tokenCookie", token, { maxAge: 9000000, httpOnly: true }); // TODO: add secure flag for PROD
                response.status(200).json({ token: token });
	        return;
              });
	    } else {
              response.status(401).json({ error: "wrong credentials" });
	      return;
	    }
	  })();
	});
      } else {
        response.status(401).json({ error: "wrong credentials"});
	return;
      }
    });
  } else /* email */ {
    pool.query("SELECT * FROM users WHERE email = $1"/* AND password = $2"*/, [email/*, password*/], (error, results) => {
      if (error) {
        // throw Error;
	response.status(401).json({ error: "wrong credentials"});
	return;
      }
     
      // @ts-ignore
      if (results?.rows[0]?.email === email) {
	if (results?.rows[0]?.is_active !== true) {
	  response.status(401).json({ error: "Account not activated yet. Check your email for verification code"});
	  return;
	}

	const token = crypto.randomBytes(64).toString("hex");
        
        // get IV from database 
        pool.query("SELECT * FROM users WHERE email = $1", [email], (error, results) => {
          if (error) {
	    response.status(401).json({ error: error.message });
	    return;
          }

	  let iv = "";

          if (results?.rows[0]?.password) {
            if (/\:/.test(results.rows[0].password)) {
              iv = results.rows[0].password.split(":")[0];
            } else {
              response.status(401).json({ error: "Unable to retrieve IV" });
            }
          } else {
            response.status(401).json({ error: "Unable to retrieve IV" });
            return;
          }

          (async() => {
            const userHashedPassword = await hashWithIV(password, iv);
            if (userHashedPassword === results?.rows[0]?.password) {
              pool.query("UPDATE users SET token = $1 WHERE email = $2 AND password = $3", [token, email, userHashedPassword], (error, results) => {
                if (error) {
                  response.status(401).json({ error: error.message });
                  return;
                }

                response.status(200).json({ token: token });
                return;
              });
            } else {
              response.status(401).json({ error: "wrong credentials" });
              return;
            }
          })();
	});
      }
    });

  }
  return;
}

const updateUserBio = (request: Request, response: Response) => {
  const { bio } = request.body;
console.log("The bio: " + bio);
  const userID = request?.headers?.user_id; // this header is internal, set by authMiddleware
  pool.query("UPDATE users SET bio = $1 WHERE id = $2", [bio, userID], (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message});
      return;
    }

    response.status(200).send({ status: "Bio updated" });
  });
}



/* POSTS (PUBLICACIONES) */
const getUserPosts = (request: Request, response: Response) => {
  const userID = request?.headers?.user_id;

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
  const userID = request?.headers?.user_id; // this header is internal, set by authMiddleware

  if (userID) {
    pool.query("INSERT INTO posts (user_id, title, post) VALUES ($1, $2, $3)", [userID, title, post], (error, results) => {
      if (error) {
        console.log(error);
	return;
      }

      response.status(200).send({ status: "Done" });
    });
  } else {

  }
}

const editUserPost = () => {};

const deleteUserPost = () => {};


const signin = (request: Request, response: Response) => {
  const { phone, email, username, password, firstName, lastName, middleName, gender, country, profilePictureUrl } = request.body;

  const rol = "user";
  const verificationCode = crypto.randomInt(0, 999999);
console.log("VER-CODE: " + verificationCode); // print in console for debug (avoid open emails constantly
  const isActive = false;
  const isReported = false;
  const isBlocked = false;
  const bio = "";

  if (!phone) {
    response.status(401).send({ error: "missing phone" });
  }

  if (!/^\d+$/.test(phone)) {
    response.status(401).send({ error: "phone number not valid format" });
    return;
  }

  if (!email) {
    response.status(401).send({ error: "missing email" });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    response.status(401).send({ error: "email not valid format" });
    return;
  }

  if (!/^\w+$/.test(username)) {
    response.status(401).send({ error: "username not valid format" });
    return;
  }

  if (!password) {
    response.status(401).send({ error: "missing password" });
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
  if (trimedFirstName.length < 2 ) {
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

  if (!gender) {
    response.status(401).send({ error: "missing gender" });
  }

  if (gender !== "male" && gender !== "female" && gender !== "other") {
    response.status(401).send({ error: "chose 'male', 'female' or 'other'" });
    return;
  }

  if (!country) {
    response.status(401).send({ error: "missing country" });
  }

  if (country.length > 100) {
    response.status(401).send({ error: "country is to long" });
    return;
  }

  if (!profilePictureUrl) {
    // allow signin without picture ?
  }

  if (/javascript\:/gi.test(profilePictureUrl) || /data\:/gi.test(profilePictureUrl)) {
    response.status(401).send({ error: "hacking disabled" });
    return;
  }

  if (profilePictureUrl.length > 250) {
    response.status(401).send({ error: "url is to long" });
  }

  /* TODO: Check if username already exists */
  pool.query("SELECT * FROM users WHERE username = $1", [username], (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message });
      return;
    }

    if (results?.rows[0]?.username === username) {
      response.status(401).send({ error: "This username is already taken" });
      return;
    }


    (async() => {
      try {
        const hashedPassword = await hash(password);
        /* TODO: Insert into database timestamp and user active false */
        pool.query(
          "INSERT INTO users (phone, email, username, password, first_name, last_name, middle_name, gender, country, profile_picture_url, rol, verification_code, verification_code_time, is_active, is_reported, is_blocked, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
          [phone, email, username, hashedPassword, firstName, lastName, middleName, gender, country, profilePictureUrl, rol, verificationCode, new Date(), isActive, isReported, isBlocked, bio], (error, results) => {
          if (error) {
            response.status(401).send({ error: error.message });
            return;
          }

  
          const subject = "Relax Social Network - Verification Code";
          const data = `Welcome to Relax.

Send us your verification code
${verificationCode}

Have a great stance.
`;

          sendMail(email, subject, data);
          response.status(200).send({ status: "Email send" });
          return;
        });
      } catch (error) {
	if (error instanceof Error) {
          response.status(401).send({ error: error.message });
	}
	return;
      }
    })();
  });
}

const verificateCode = (request: Request, response: Response) => {
  const { verificationCode } = request.body;

  if (!verificationCode) {
    response.status(401).send({ error: "You forgot to send verificationCode" });
    return;
  }

  if (!(verificationCode >= 0 && verificationCode < 1000000)) {
    response.status(401).send({ error: "verification code not valid" });
    return;
  }

  pool.query("SELECT * FROM users WHERE verification_code = $1", [verificationCode], (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message });
      return
    }

    if (results?.rows[0]?.is_active === true) {
      response.status(401).send({ error: "Account already activated" });
      return;
    }

    if (results.rows[0]?.verification_code) {
      // ver_cod_time check
      if (results.rows[0]?.verification_code_time) {
	const codeGeneratedAt = results.rows[0]?.verification_code_time;
        const timePassed = (+new Date() - +new Date(codeGeneratedAt));
	if (timePassed > 86_400_000) { // 1 day in milliseconds
          response.status(401).send({ error: "Verification code expired. Request a new one" });
	  return;
	}

        if (verificationCode === results.rows[0]?.verification_code) {
          pool.query("UPDATE users SET is_active = $1 WHERE id = $2", [true, results.rows[0]?.id], (error, results) => { 
            if (error) {
              response.status(401).send({ error: error.message });
	      return;
	    }

            response.status(200).send({ status: "Account Activated" });
	    return;
	  });   
	} else {
          response.status(401).send({ error: "Verification_code is wrong" });
	  return;
	}

      } else {
        response.status(401).send({ error: "Verification time expiration not found in database" });
	return;
      }

    } else {
      response.status(401).send({ error: "Verification_code not found" });
      return;
    }

  });
}

const testUsernameExists = (request: Request, response: Response) => {
  if (request?.params?.username) {
    pool.query("SELECT * FROM users WHERE username = $1", [request.params.username], (error, results) => {
      if (error) {
        response.status(401).send({ error: error.message });
	return;
      }

      if (results?.rows[0]?.username === request?.params?.username) {
        response.status(200).send({ exists: true });
      } else {
        response.status(200).send({ exists: false });
      }
    });
  } else {
    response.status(401).send({ error: "Missing argument" });
  }
}

const getProfile = (request: Request, response: Response) => {
  const userID = request?.headers?.user_id; // this header is internal, set by authMiddleware
  if (userID) {
    pool.query("SELECT id, phone, rol, email, username, first_name, last_name, middle_name, gender, country, profile_picture_url, is_reported, is_blocked, bio, created_at FROM users WHERE id = $1", [userID], (error, results) => {
      if (error) {
	response.status(401).send({ error: error.message });
	return;
      }

      if (results?.rows[0]?.id === userID) {
        response.status(200).json(results.rows[0]);
      } else {
        response.status(401).send({ error: "User not found" });
      }

    });
  } else {
    response.status(401).send({ error: "Missing id" });
  } 
}

/* TODO: Filter credentials (DO NOT SEND TO CLIENT FOR PROD */
const search = (request: Request, response: Response) => {
  const userID = request?.headers?.user_id;
  if (!userID) {
    response.status(401).send({ error: "Missing token. You can't search without being logged in" });
    return;
  }

  const searchPattern = request?.params?.search;
  if (!searchPattern) {
    response.status(401).send({ error: "Missing search argument" });
  }


  pool.query("SELECT first_name, username FROM users WHERE username ILIKE $1", [`%${searchPattern}%`], (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message });
      return;
    }

    const obj = {} as any;

    if (results?.rows) {
      // TODO: Filter results from posts titles to only posts marked as public OR from public accounts
      obj.users = results.rows;
      //response.status(200).json(results.rows);
      //return;
    } 

    pool.query("SELECT title, bio FROM groups WHERE title ILIKE $1", [`%${searchPattern}%`], (error, results) => {
      if (error) {
        response.status(401).send({ error: error.message })
	return;
      }

      if (results?.rows) {
        obj.groups = results.rows;
      }

      pool.query("SELECT title FROM posts WHERE title ILIKE $1", [`%${searchPattern}%`], (error, results) => {
        if (error) {
          response.status(401).send({ error: error.message });
	  return;
	}

	if (results?.rows) {
          obj.posts = results.rows;
	}

        if (Object.keys(obj).length === 0) {
          response.status(401).send({ error: "No results" });
	} else {
  	  response.status(200).json(obj);
	  return;
	}
      });
    });
  });
}

const getUserByUsername = (request: Request, response: Response) => {
  let username = request?.params?.username;
  if (username && username[0] === "@") {
    username = username.substr(1, username.length - 1);
  }

  if (!username) {
    response.status(401).send({ error: "Missing argument username" });
    return;
  } 
  // TODO: if profile matchs himself, call getProfile manually instead? 
  pool.query("SELECT id, phone, rol, email, username, first_name, last_name, middle_name, gender, country, profile_picture_url, is_reported, is_blocked, bio, created_at FROM users WHERE username = $1", [username], (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message });
      return;
    }

    if (results?.rows[0]) {
      response.status(200).json(results.rows[0]);
      return;
    }

    response.status(401).send({ error: "username not found" });   
  });

}

const getPostsByUsername = (request: Request, response: Response) => {
  let username = request?.params?.username;
// TODO: Make sure not allowed to create users starting by @ in signin endpoint
  if (username && username[0] === "@") {
    username = username.substr(1, username.length - 1);
  }

  if (!username) {
    response.status(401).send({ error: "Missing token" });
    return;
  }
 
  // get user_id from username to query posts table
  pool.query("SELECT ID FROM users WHERE username = $1", [username], (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message });
      return;
    }

    const user_id = results?.rows[0]?.id;
    if (!user_id) {
      response.status(401).send({ error: "username not found" });
      return;
    }

    pool.query("SELECT * FROM posts WHERE user_id = $1 ORDER BY post_id DESC", [user_id], (error, results) => {
      if (error) {
        response.status(401).send({ error: error.message });
        return;
      }

      if (results?.rows[0]) {
        response.status(200).json(results.rows);
        return;
      } else {
        response.status(401).send({ error: "username not found" });
	return;
      }
    });
  });
};

// get user list of friends
const getFriends = (request: Request, response: Response) => {
  const userID = request?.headers?.user_id;
  if (!userID) {
    response.status(401).send({ error: "Missing token" });
    return;
  }

  pool.query("SELECT friend_username FROM friends WHERE user_id = $1", [userID], (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message });
      return;
    }

    if (results?.rows[0]) {
      response.status(200).json(results.rows);
      return;
    } else {
      response.status(401).send({ error: "No friends found" });
      return;
    }
  });
}

// get list of friends from an user
const getFriendsByUsername = (request: Request, response: Response) => {

}

// add a friend to a user's friends list
const addFriendByUsername = (request: Request, response: Response) => {
  const userID = request?.headers?.user_id;
  if (!userID) {
    response.status(401).send({ error: "Missing token" });
    return;
  }

  let { username } = request?.body;

  if (username && username[0] === "@") {
    username = username.substr(1, username.length - 1);
  }

  if (!username) {
    response.status(401).send({ error: "Missing argument username" });
    return;
  }

  pool.query("SELECT * FROM users WHERE id = $1", [userID], (error, results) => {
    if (error) {
      response.status(401).send({ error: error.message });
      return;
    }

    if (!results?.rows[0]?.id) {
      response.status(401).send({ error: "username not found" });
    }

    pool.query("INSERT INTO friends (user_id, friend_username) VALUES ($1, $2)", 
      [userID, username], (error, results) => {
      if (error) {
        response.status(401).send({ error: error.message });
	return;
      }

      response.status(200).send({ status: "Done" });
      return;
    });
  });
}




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
  deleteUserPost,

  signin,
  verificateCode,
  testUsernameExists,
  getProfile,

  search,
  getUserByUsername,
  getPostsByUsername,
  getFriends,
  getFriendsByUsername,
  addFriendByUsername
}

