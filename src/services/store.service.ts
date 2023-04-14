import { Prisma, PrismaClient } from "@prisma/client";
import { sendError } from "../libraries/rest";
import pagination from "../middleware/pagination";
import { InputStore, Store, StoreResponse } from "../models/store";

export default class StoreService extends PrismaClient {
    private prisma = new PrismaClient();

    public findStore = async (where: Prisma.StoreWhereInput = {}, req: any): Promise<Store | null> => {
        const store = await this.prisma.store.findFirst({
            where: {
                ...where,
            },
        });

        if (!store) {
            // throw new sendError('Store not found', [], 'NOT_FOUND')
            return null;
        }

        return store;
    }

    public findStores = async (where: Prisma.StoreWhereInput = {}, req: any): Promise<StoreResponse> => {
        let { page, limit } = req.query;
        const filter = req.query.filter ? req.query.filter : 'all';
        const shop_type = req.query.shop_type === 'all' ? '' : req.query.shop_type;
        page = page ? parseInt(page) : 1;
        limit = limit ? parseInt(limit) : 10;

        switch (filter) {
            case 'authorized':
                where = {
                    ...where,
                    status: true,
                }
                break;
            case 'expired':
                where = {
                    ...where,
                    status: false,
                }
                break;
            case 'deactive':
                where = {
                    ...where,
                    status: false,
                }
                break;
            default:
                break;
        }

        if (shop_type || shop_type !== '') {
            where = {
                ...where,
                shop_type: shop_type
            }
        }

        const stores = await this.prisma.store.findMany({
            where: {
                ...where,
            },
            skip: (page - 1) * limit,
            take: limit,
        })

        const total = await this.prisma.store.count({
            where: {
                ...where,
            }
        })

        return {
            data: stores,
            pagination: pagination(page, limit, total)
        }
    }

    public createStore = async (data: InputStore): Promise<Store> => {
        const store = await this.prisma.store.create({
            data: {
                domain: data.domain,
                name: data.name,
                shop_type: data.shop_type,
                region: data.region,
                shop_id: data.shop_id,
                user_id: data.user_id,
                authorization_time: new Date(),
                status: data.status,
            }
        });

        return store;
    }

    public deleteStore = async (where: Prisma.StoreWhereInput, req: any): Promise<Store> => {
        const find = await this.findStore(where, req);
        if (!find) {
            throw new sendError('Store not found', [], 'NOT_FOUND')
        }
        const store = await this.prisma.store.delete({
            where: {
                id: find.id
            }
        });

        return store;
    }
}