import { AuthRequest } from "../config/types";
import { Permission , rolePermission, ROLE ,toRole} from "../config/roles";
import { NextFunction, Request, Response } from "express";
import { AuthenticationFailedException } from "../util/exceptions/http/AuthenticationExceptions";
import { InsufficientPermissionException, InvalidRoleException } from "../util/exceptions/http/AuthorizationException";
import logger from "../util/logger";

export function hasPermission(permission: Permission){
    return (req:Request, res:Response, next:NextFunction) =>{

        const authreq= req as AuthRequest;
        if(!authreq.user){
            throw new AuthenticationFailedException();
        }
        const userRole= toRole(authreq.user.role);

        if(!rolePermission[userRole]){
            logger.error("invalid role "+ userRole);
            throw new InvalidRoleException(userRole);
        }
        if(!rolePermission[userRole].includes(permission)){
            logger.error("use with role "+ userRole+ " does not have permission "+ permission);
            throw new InsufficientPermissionException();
        }
        next();      
    } 
}
export function hasRole(allowedrole: ROLE[]){
    return (req:Request, res:Response, next:NextFunction) =>{

        const authreq=req as AuthRequest;
        if(!authreq.user){
            throw new AuthenticationFailedException();
        }
        const userRole=authreq.user.role;
        if(!allowedrole.includes(userRole)){
            logger.error("use with role "+ userRole+ " does not have permission ");
            throw new InsufficientPermissionException();
        }
        next();
    }
}