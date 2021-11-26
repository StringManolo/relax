import { Client } from "pg";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

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



/* <main> */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({
    info: "SNR API"
  });
});

app.listen(port, () => {
  console.log("Server binded to localhost:" + port);
});
/* </main> */
