import pool from "./pool";
import { Request, Response } from "express";

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


const updateUserBio = (request: Request, response: Response) => {
console.log("Updating bio...");
  const { bio } = request.body;
  pool.query("UPDATE users SET bio = $1 WHERE id = $2", [bio, +request.params.id], (error, results) => {
    if (error) {
console.log(error);
      throw error;
    }

    response.status(200).send(`Bio updated`);
  });
}

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,

  updateUserBio
}

