import { body, validationResult, matchedData } from "express-validator";
import usersStorage from "../storages/usersStorage.js";
import type { Request, Response } from "express";

export const validateUser = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required."),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address."),

  body("age")
    .optional({ values: "falsy" })
    .isInt({ min: 18, max: 120 })
    .withMessage("Age must be between 18 and 120."),

  body("bio")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Bio must be 200 characters or fewer."),
];

export const usersListGet = async (req: Request, res: Response) => {
  try {
    const users = await usersStorage.getUsers();

    return res.render("users", {
      title: "User List",
      users,
      name: "",
      email: "",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).send("Failed to load users.");
  }
};

export const usersCreateGet = async  (req: Request, res: Response) => {
  res.render("createUser", {
    title: "Create User",
    errors: [],
  });
};

export const usersCreatePost =  async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("createUser", {
      title: "Create User",
      errors: errors.array(),
    });
  }

  const data = matchedData(req) as {
    firstName: string;
    lastName: string;
    email: string;
    age?: string;
    bio?: string;
  };

   await  usersStorage.addUser({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    ...(data.age ? { age: Number(data.age) } : {}),
    ...(data.bio ? { bio: data.bio } : {}),
  });

  return res.redirect("/users");
};

export const usersSearchGet = async (req: Request, res: Response) => {
  const name = String(req.query.name ?? "").trim();
  const email = String(req.query.email ?? "").trim();

 const allUsers = await usersStorage.getUsers();

const users = allUsers.filter((user) => {
    const matchesName = `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(name.toLowerCase());

    const matchesEmail = user.email
      .toLowerCase()
      .includes(email.toLowerCase());

    return matchesName && matchesEmail;
  });

  return res.render("users", {
    title: "User List",
    users,
    name,
    email,
  });
};

export const usersEditGet =async  (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).send("Invalid user ID");
  }

  const user =  await usersStorage.getUser(id);

  if (!user) {
    return res.status(404).send("User not found");
  }

  return res.render("editUser", {
    title: "Edit User",
    user,
    errors: [],
  });
};

export const usersUpdatePost =async  (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const errors = validationResult(req);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).send("Invalid user ID");
  }

  const user = await  usersStorage.getUser(id);

  if (!user) {
    return res.status(404).send("User not found");
  }

  if (!errors.isEmpty()) {
    return res.status(400).render("editUser", {
      title: "Edit User",
      user: {
        ...user,
        firstName: String(req.body.firstName ?? ""),
        lastName: String(req.body.lastName ?? ""),
        email: String(req.body.email ?? ""),
        age: req.body.age ? Number(req.body.age) : undefined,
        bio: String(req.body.bio ?? ""),
      },
      errors: errors.array(),
    });
  }

  const data = matchedData(req) as {
    firstName: string;
    lastName: string;
    email: string;
    age?: string;
    bio?: string;
  };

const updatedUser =  await usersStorage.updateUser(id, {
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  ...(data.age ? { age: Number(data.age) } : {}),
  bio: data.bio ?? "",
});

  if (!updatedUser) {
    return res.status(404).send("User not found");
  }

  return res.redirect("/users");
};

export const usersDeletePost = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).send("Invalid user ID");
  }

  const deleted = await usersStorage.deleteUser(id);

  if (!deleted) {
    return res.status(404).send("User not found");
  }

  return res.redirect("/users");
};