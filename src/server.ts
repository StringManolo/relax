import { Client } from "pg";

const exit = (exitMsg: string) => {
  console.error(exitMsg);
  process.exit(-1);
}

const config = {
  user: "stringmanolo",
  host: "localhost",
  password: "temp",
  port: 5432
};


