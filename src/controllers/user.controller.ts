import { Request, Response } from "express";
import { UserService } from "../services/userManagment.service";
import { User } from "../model/User.model";
import { NotFoundException } from "../util/exceptions/http/NotFoundException";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import { generateUUID } from "../util/index";
import { ServiceException } from "../util/exceptions/http/ServiceException";
import logger from "../util/logger";
import { toRole } from "../config/roles";

export class UserController {

    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async createUser(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                throw new BadRequestException("Name, Email and Password are required", {
                    name: !name,
                    email: !email,
                    password: !password
                });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                throw new BadRequestException("Invalid email format")
            }

            const newUser = new User(generateUUID("user"), name, email, password, toRole('user'));
            const newId = await this.userService.createUser(newUser);
            try{
                const createdUser = await this.userService.getUserById(newId);
                res.status(201).json(createdUser);
            }catch(error){
                res.status(201).json({message:"User created but unable to fetch user details",id: newId});
            }
        } catch (error) {
            logger.error("Error Creating User", error);
            throw new ServiceException("Error Creating User");
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                throw new BadRequestException("Id is required to get order",{IdNotDefined: true});
            }
            const user = await this.userService.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            logger.error("User not found", error as Error);
            throw new NotFoundException("User not found");
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            throw new ServiceException("Error Getting All Users");
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const { name, email, password } = req.body;

            if (!id || Array.isArray(id)) {
                throw new BadRequestException("Id is required to update user",{ IdNotDefined: true });
            }
            if (!name && !email && !password) {
                throw new BadRequestException("At least one field is required to update the user",{
                    name: !name,
                    email: !email,
                    password: !password
                });
            }
            const existingUser = await this.userService.getUserById(id);
            const updatedUser = new User(
                id,
                name || existingUser.getName(),
                email || existingUser.getEmail(),
                password || existingUser.getPassword(),
                toRole(existingUser.role)
            );
            await this.userService.updateUser(updatedUser);
            const result = await this.userService.getUserById(id);
            res.status(200).json(result);

        } catch (error) {
            logger.error("Error Updating User", error as Error);
            if ((error as Error).message === "User not found") {
                throw new NotFoundException("User not found");
            }
            throw new ServiceException("Error Updating User");
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            
                if (!id || Array.isArray(id)) {
                throw new BadRequestException("Id is required to get order",{IdNotDefined: true});
            }
            await this.userService.deleteUser(await this.userService.getUserById(id));
            res.status(204).send();
        } catch (error) {
            logger.error("Error Deleting User", error as Error);
            if(error instanceof BadRequestException) {
                throw error;
            }
            if((error as Error).message === "User not found"){
                throw new NotFoundException("User not found");
            }
            throw new ServiceException("Error Deleting User");
        }   
    }
}