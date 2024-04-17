import express from "express";
//import dotenv from "dotenv";
import { ticketRouter } from "./actions/router";

//dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(ticketRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
