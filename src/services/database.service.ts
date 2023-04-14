import { PrismaClient } from '@prisma/client'
import * as mongoDB from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

export class DatabaseConnect {
    private prisma: PrismaClient;

    public constructor(user_id?: string) {
        this.prisma = new PrismaClient()

        this.connect(user_id)
    }

    public collection: {
        products?: mongoDB.Collection,
        shops?: mongoDB.Collection
    } = {}

    public connect = async (user_id?: string) => {
        let databaseUrl: string = process.env.DATABASE_URL || ''
        if (user_id) {
            const databaseUser = await this.prisma.databaseUser.findFirst({
                where: {
                    user_id: user_id
                }
            })

            if (!databaseUser) {
                databaseUrl = process.env.DATABASE_URL || ''
            }

            databaseUrl = databaseUser?.database_url || ''
        }

        if (databaseUrl === '' || databaseUrl === undefined || databaseUrl === null) {
            databaseUrl = process.env.DATABASE_URL || ''
        }
        console.log(databaseUrl)

        const client: mongoDB.MongoClient = await mongoDB.MongoClient.connect(databaseUrl)
        await client.connect()

        const db = client.db('marketplace-db')
        const products: mongoDB.Collection = db.collection('products')
        const shops: mongoDB.Collection = db.collection('shops')

        this.collection.products = products
        this.collection.shops = shops

        console.log('Database connected')
    }
}