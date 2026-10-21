
import { Router } from "express";
import {
  usersListGet,
  usersCreateGet,
  usersCreatePost,
  usersSearchGet,
  usersEditGet,
  validateUser,
  usersDeletePost,
  usersUpdatePost,
} from "../controllers/usersController.js";

const usersRouter = Router();

usersRouter.get("/", usersListGet);

usersRouter.get("/search", usersSearchGet);

usersRouter.get("/create", usersCreateGet);

usersRouter.post("/create", validateUser, usersCreatePost);

usersRouter.post("/:id/delete", usersDeletePost);
usersRouter.post("/:id/update", validateUser, usersUpdatePost);

usersRouter.get("/:id/edit", usersEditGet);

export default usersRouter;
