import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import indexRouter from "./routes/indexRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", indexRouter);


app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "404.html"));
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});