import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { UserService } from "../services/userManagment.service";
import { authenticate } from "../middleware/auth";

const service = new UserService()

const userController = new UserController(service);

const userRoutes = Router();

userRoutes.route("/")
    .post(asyncHandler(userController.createUser.bind(userController)))
    .get(authenticate, asyncHandler(userController.getAllUsers.bind(userController)));
userRoutes.route("/:id")
    .get(authenticate, asyncHandler(userController.getUserById.bind(userController)))
    .put(authenticate,asyncHandler(userController.updateUser.bind(userController)))
    .delete(authenticate, asyncHandler(userController.deleteUser.bind(userController)));



export default userRoutes;