import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from './async';
import { Response, NextFunction } from 'express';
import { sendError } from '../libraries/rest';
import { RequestAny } from '../interfaces/request';
import { findUser } from '../models/user';
import { PrismaClient } from '@prisma/client';
import { UserProps } from '../interfaces/user';

const prisma = new PrismaClient()

const jwt_secret = process.env.JWT_SECRET || 'secret';

export const protect = asyncHandler(async (req: RequestAny, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new sendError('Not authorized to access this route', [], 'UNAUTHORIZED'));
    }

    if (token.split('.').length !== 3) {
        return next(new sendError('Not authorized to access this route', [], 'UNAUTHORIZED'));
    }

    const decoded: JwtPayload = jwt.verify(token, jwt_secret) as JwtPayload

    const user = await findUser({ id: decoded.id })

    if (!user) {
        return next(new sendError('Not authorized to access this route', [], 'UNAUTHORIZED'));
    }

    if (user.status === 'banned') {
        return next(new sendError('Account has been banned, please contact admin', [], 'UNAUTHORIZED'));
    }

    req.user = user;

    next();
})

export const withToken = asyncHandler(async (req: RequestAny, res: Response, next: NextFunction) => {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token
    }

    if (token) {
        if (token.split('.').length !== 3) {
            return next(new sendError('Not authorized to access this route', [], 'UNAUTHORIZED'));
        }

        const decoded: JwtPayload = jwt.verify(token, jwt_secret) as JwtPayload;

        if (!decoded) {
            return next(new sendError('Not authorized to access this route', [], 'UNAUTHORIZED'));
        }

        const user = await findUser({ id: decoded.id })

        if (!user) {
            return next(new sendError('Not authorized to access this route', [], 'UNAUTHORIZED'));
        }

        if (user.status === 'banned') {
            return next(new sendError('Account has been banned, please contact admin', [], 'UNAUTHORIZED'));
        }

        req.user = user;
    }

    next();
})