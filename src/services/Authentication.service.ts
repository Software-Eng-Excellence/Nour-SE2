import jwt from 'jsonwebtoken';
import config from '../config';
import { TokenPayLoad, userPayload } from '../config/types';
import logger from '../util/logger';
import { InvalidTokenException ,TokenExpiredException } from '../util/exceptions/http/AuthenticationExceptions';
import { ServiceException } from '../util/exceptions/http/ServiceException';
import ms from 'ms';
import { Response } from 'express';

export class AuthenticationService{

    constructor(
        private secretKey = config.auth.secretKey,
        private tokenExpiration = config.auth.tokenExpiration,
        private refreshTokenExpiration = config.auth.refreshTokenExpiration,
    ) {}

    generateToken(payload: userPayload): string {
        return jwt.sign(
            payload,
            this.secretKey,
            {expiresIn: this.tokenExpiration }
        );
    }

    generateRefreshToken(payload: userPayload): string {
        return jwt.sign(
            payload,
            this.secretKey,
            {expiresIn: this.refreshTokenExpiration }
        );
    }

    verify(token: string): userPayload{
        try{
           return jwt.verify(token, this.secretKey) as unknown as userPayload;
        } catch(error){
            logger.error('Token verification failed', error);
            if(error instanceof jwt.TokenExpiredError){
                throw new TokenExpiredException();
            }
            if(error instanceof jwt.JsonWebTokenError){
                throw new InvalidTokenException();
            }
            throw new ServiceException("Token verification failed");
        }
    }

    refreshToken(refreshToken: string):string{
        const payload = this.verify(refreshToken);
        if(!payload){
            throw new InvalidTokenException();
        }
        return this.generateToken(payload)
    }

    setTokenIntoCookie(res: Response, token:string){
        res.cookie('token', token, {
            httpOnly: true,
            secure: config.isProduction,
            maxAge: ms(this.tokenExpiration),
        });
    }

    setRefreshTokenIntoCookie(res: Response, refreshToken:string){  
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.isProduction,
            maxAge: ms(this.refreshTokenExpiration),
        });
    }

    clearTokens(res: Response){
        res.clearCookie('token')
        res.clearCookie('refreshToken')
    }

    persistAuthentication(res:Response, payload: userPayload){
        const token = this.generateToken(payload);
        const refreshToken = this.generateRefreshToken(payload);
        this.setTokenIntoCookie(res, token);
        this.setRefreshTokenIntoCookie(res, refreshToken);
    }
}