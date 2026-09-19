import express from 'express';
import {asyncHandler} from '../middleware/asyncHandler';
import { AuthenticationService } from '../services/Authentication.service';
import { UserService } from '../services/userManagment.service';
import { UserController } from '../controllers/user.controller';
import { AuthenticationController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

// create route
const router = express.Router();

// Initialize dependences
const authService = new AuthenticationService();

const userService = new UserService()
const userController = new UserController(userService);

const authController = new AuthenticationController(authService, userService);

// Define routes
router.route('/login')
    .post(asyncHandler(authController.login.bind(authController)));

router.route('/logout')
    .get(authenticate, authController.logout.bind(authController));

export default router;