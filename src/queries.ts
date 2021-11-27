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



export {
  getUsers,
  getUserById
}
