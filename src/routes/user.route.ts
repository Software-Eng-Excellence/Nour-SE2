import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { UserService } from "../services/userManagment.service";

const service = new UserService()

const userController = new UserController(service);

const userRoutes = Router();

userRoutes.route("/")
    .post(asyncHandler(userController.createUser.bind(userController)))
    .get(asyncHandler(userController.getAllUsers.bind(userController)));
userRoutes.route("/:id")
    .get(asyncHandler(userController.getUserById.bind(userController)))
    .put(asyncHandler(userController.updateUser.bind(userController)))
    .delete(asyncHandler(userController.deleteUser.bind(userController)));



export default userRoutes;