import express from "express";
import { loginUser, registerUser, listUsers, updateUser, removeUser } from "../controllers/userController.js";

const userRouter = express.Router();

// Authentication routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// User management routes
userRouter.get("/list", listUsers); // Fetch all users
userRouter.put("/update", updateUser); // Update user details
userRouter.post("/remove", removeUser); // Remove a user

export default userRouter;
