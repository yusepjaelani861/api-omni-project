import { Prisma, PrismaClient } from "@prisma/client";
import { UserProps } from "../interfaces/user";
import { Response } from "express";
import jsonwebtoken from 'jsonwebtoken'
import { sendResponse } from "../libraries/rest";

const prisma = new PrismaClient();

const jwtSecret = process.env.JWT_SECRET || 'secret';
const jwtExpire = process.env.JWT_EXPIRE || '30';

export class UserModel {
    public findUser = async (where: Prisma.UserWhereInput): Promise<UserProps | null> => {
        const user = await prisma.user.findFirst({
            where: {
                ...where,
            },
            select: {
                id: true,
                role_id: true,
                name: true,
                phone_number: true,
                email: true,
                avatar: true,
                status: true,
                password: true,
                created_at: true,
                updated_at: true,
                role: true,
            },
        });

        if (!user) {
            return null;
        }

        return user;
    }

    public createUser = async (data: Prisma.UserCreateInput): Promise<UserProps> => {
        const user = await prisma.user.create({
            data,
            select: {
                id: true,
                role_id: true,
                name: true,
                phone_number: true,
                email: true,
                avatar: true,
                status: true,
                password: true,
                created_at: true,
                updated_at: true,
                role: true,
            },
        });

        return user;
    }

    public sendTokenResponse = (user: UserProps, res: Response) => {
        const token = jsonwebtoken.sign({ id: user.id }, jwtSecret, {
            expiresIn: Number(jwtExpire) * 24 * 60 * 60,
        });

        res.setHeader(
            "Set-Cookie",
            `token=${token}; HttpOnly; Domain=${process.env.FRONTEND_AUTH_URL
            }; SameSite=Strict; Max-Age=${Number(jwtExpire) * 24 * 60 * 60
            }; Path=/;`
        );

        return res.json(new sendResponse({
            user: {
                id: user.id,
                role_id: user.role_id,
                name: user.name,
                phone_number: user.phone_number,
                email: user.email,
                avatar: user.avatar,
                status: user.status,
                created_at: user.created_at,
                updated_at: user.updated_at,
            },
            token: token,
            expiredIn: Number(jwtExpire) * 24 * 60 * 60,
        }, 'Success login'));
    }
}

export const findUser = async (where: Prisma.UserWhereInput): Promise<UserProps | null> => {
    const user = await prisma.user.findFirst({
        where,
        select: {
            id: true,
            role_id: true,
            name: true,
            phone_number: true,
            email: true,
            avatar: true,
            status: true,
            password: true,
            created_at: true,
            updated_at: true,
            role: true,
        },
    });

    return user;
}