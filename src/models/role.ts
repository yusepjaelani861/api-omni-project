import { Prisma, PrismaClient } from "@prisma/client";
import { RoleProps } from "../interfaces/role";

const prisma = new PrismaClient();

export class RoleModel {
    public findRole = async (where: Prisma.RoleWhereInput): Promise<RoleProps| null> => {
        const role = await prisma.role.findFirst({
            where,
            select: {
                id: true,
                name: true,
                description: true,
                created_at: true,
                updated_at: true,
            },
        });

        return role;
    }

    public createRole = async (data: Prisma.RoleCreateInput): Promise<RoleProps> => {
        const role = await prisma.role.create({
            data,
            select: {
                id: true,
                name: true,
                description: true,
                created_at: true,
                updated_at: true,
            },
        });

        return role;
    }
}