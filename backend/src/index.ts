import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import router from "./routes/index.routes";
import db from "./config/db.config";
import { logger } from "./utils/console.utils";

dotenv.config();

const PORT = process.env.PORT || 5050;
const FRONTEND = process.env.FRONTEND_LINK || "http://localhost:3000";
const app: Express = express();

app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(express.json());
app.use(cors({ origin: FRONTEND }));

app.use("/", router);

const port = PORT;

app.listen(port, () => {
  try {
    db.on("connected", function () {
      logger("info", "database is connected successfully");
      logger("info", `[server]: Server is running at http://localhost:${port}`);
    });

    db.on("disconnected", function () {
      logger("warn", "database is disconnected successfully");
    });

    db.on("error", function () {
      logger("error", "Database Errored Out");
    });
  } catch (error) {
    logger(
      "error",
      `Server startup error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
});
