import { Pool } from "pg";

/* TODO: Strip for production, test and fill with real credentials */
const pool = new Pool({
  user: "snradmin",
  host: "localhost",
  database: "snr",
  password: "tmp",
  port: 5432
});

export default pool;
