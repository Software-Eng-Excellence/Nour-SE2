import {Request} from "express";
import {JwtPayload} from "jsonwebtoken";
import { ROLE } from "./roles";

export enum DBMode {
    FILE,
    POSTGRESQL,
    SQLITE,
}
export interface userPayload {
    userId: string;
    role:ROLE;
}

export interface TokenPayLoad extends JwtPayload{
    user: userPayload;
}

export interface AuthRequest extends Request {
    user: userPayload;
}