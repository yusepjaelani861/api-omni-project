import TokopediaClient from "tokopedia-client";
import dotenv from 'dotenv'
import { DatabaseConnect } from "./database.service";
import Product from "../models/product";
import { OrderStatusCode } from "tokopedia-client/lib/modules/order/request/GetOrderRequest";
import AcceptOrderResponse from "tokopedia-client/lib/modules/order/response.ts/AcceptOrderResponse";
import GetSingleOrderResponse from "tokopedia-client/lib/modules/order/response.ts/GetSingleOrderResponse";
import GetOrderResponse from "tokopedia-client/lib/modules/order/response.ts/GetOrderResponse";
import RejectOrderResponse from "tokopedia-client/lib/modules/order/response.ts/RejectOrderResponse";
import RejectOrderRequest from "tokopedia-client/lib/modules/order/request/RejectOrderRequest";
import UpdateOrderStatusRequest from "tokopedia-client/lib/modules/order/request/UpdateOrderStatusRequest";
import UpdateOrderStatusResponse from "tokopedia-client/lib/modules/order/response.ts/UpdateOrderStatusResponse";
import { GetProductInfoResponse } from "tokopedia-client/lib/modules/product/response/GetProductInfoResponse";
import getAllActiveProductsRequest from "tokopedia-client/lib/modules/product/request/getAllActiveProductsRequest";
import getAllProductRequest from "tokopedia-client/lib/modules/product/request/getAllProductRequest";
import GetAllProductResponse from "tokopedia-client/lib/modules/product/response/GetAllProductResponse";
import GetAllActiveProductResponse from "tokopedia-client/lib/modules/product/response/GetAllActiveProductResponse";
import getProductByShopRequest from "tokopedia-client/lib/modules/product/request/getProductByShopRequest";
import CreateProductRequest from "tokopedia-client/lib/modules/product/request/CreateProductRequest";
import CreateProductResponse from "tokopedia-client/lib/modules/product/response/CreateProductResponse";
import UpdateProductRequest from "tokopedia-client/lib/modules/product/request/UpdateProductRequest";
import UpdateProductResponse from "tokopedia-client/lib/modules/product/response/UpdateProductResponse";
import DeleteProductResponse from "tokopedia-client/lib/modules/product/response/DeleteProductResponse";
import axios from "axios";

dotenv.config()

type GetOrderRequest = {
    from_date: number,
    to_date: number,
    shop_i?: number,
    warehouse_id?: number,
    status?: OrderStatusCode,
    page?: number | 1,
    per_page?: number | 10,
}

interface AuthenticateResponse {
    access_token: string,
    expires_in: number,
    token_type: string,
}

export default class TokopediaService extends DatabaseConnect {
    private clientId: string;
    private clientSecret: string;
    private fsId: string;
    private client: TokopediaClient | any;

    constructor() {
        super()
        this.clientId = process.env.TOKOPEDIA_CLIENT_ID || "";
        this.clientSecret = process.env.TOKOPEDIA_CLIENT_SECRET || "";
        this.fsId = process.env.TOKOPEDIA_FS_ID || "";

        this.authenticate();
    }

    async authenticate() {
        const client = new TokopediaClient({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            fs_id: this.fsId,
        });

        await client.authenticate();

        this.client = client;
    }

    // Products
    public async getAllProduct(request: getAllProductRequest): Promise<GetAllProductResponse> {
        if (!this.client) {
            await this.authenticate();
        }

        const products = await this.client.product.getAllProduct(request)

        return products;
    }

    public async getAllActiveProduct(request: getAllActiveProductsRequest): Promise<GetAllActiveProductResponse> {
        if (!this.client) {
            await this.authenticate();
        }

        const products = await this.client.product.getAllActiveProduct(request)

        return products;
    }

    public async getProductByShop(request: getProductByShopRequest, user_id?: string): Promise<GetProductInfoResponse> {
        if (!this.client) {
            await this.authenticate();
        }

        const products = await this.client.product.getProductByShop(request)

        await Promise.all(products.data.map(async (product: Product) => {
            this.connect(user_id)
            const checkProduct = await this.collection.products?.findOne(
                { productID: product.basic.productID }
            )
            console.log(checkProduct)
            if (checkProduct) {
                console.log('product already exist')
                return;
            } else {
                product.productID = product.basic.productID
                product.shopID = request.shop_id
                const send = await this.collection.products?.insertOne(product)
                console.log(send)
            }
        }))

        return products.data;
    }

    public async getProductInfo(product_id?: number[], product_url?: string[]): Promise<GetProductInfoResponse[]> {
        if (!this.client) {
            await this.authenticate();
        }

        return await this.client.product.getProductInfo({
            product_id: product_id,
            product_url: product_url,
        })
    }

    public async getProductById(product_id: number): Promise<any> {
        if (!this.client) {
            await this.authenticate();
        }

        return await this.client.product.getProductById(product_id)
    }

    public async getProductBySku(sku: string): Promise<GetProductInfoResponse[]> {
        if (!this.client) {
            await this.authenticate();
        }

        return await this.client.product.getProductBySku(sku)
    }

    public async createProduct(request: CreateProductRequest): Promise<CreateProductResponse> {
        if (!this.client) {
            await this.authenticate();
        }

        return await this.client.product.createProduct(request)
    }

    public async updateProduct(request: UpdateProductRequest): Promise<UpdateProductResponse> {
        if (!this.client) {
            await this.authenticate();
        }

        return await this.client.product.updateProduct(request)
    }

    public async deleteProduct(shop_id: number, product_id: number[]): Promise<DeleteProductResponse> {
        if (!this.client) {
            await this.authenticate();
        }

        return await this.client.product.deleteProduct(shop_id, product_id)
    }

    // Orders
    public async getOrders(request: GetOrderRequest): Promise<GetOrderResponse> {
        if (!this.client) {
            await this.authenticate();
        }

        return await this.client.order.getOrder(request)
    }

    public async getSingleOrder(id: number): Promise<GetSingleOrderResponse> {
        if (!this.client) {
            await this.authenticate();
        }

        return await this.client.order.getSingleOrder(id)
    }

    public async acceptOrder(id: number): Promise<AcceptOrderResponse> {
        if (!this.client) {
            await this.authenticate();
        }

        return await this.client.order.acceptOrder(id)
    }

    public async rejectOrder(request: RejectOrderRequest): Promise<RejectOrderResponse> {
        if (!this.client) {
            await this.authenticate();
        }

        return await this.client.order.rejectOrder(request)
    }

    public async updateStatus(request: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
        if (!this.client) {
            await this.authenticate()
        }

        return await this.client.order.updateOrderStatus(request)
    }

    // Category
    public async getCategories(keyword: string | null = null): Promise<any> {
        if (!this.client) {
            await this.authenticate();
        }

        const token = await this.generateToken()

        let url_category = `https://fs.tokopedia.net/inventory/v1/fs/${this.fsId}/product/category`
        if (keyword) url_category = url_category.concat(`?keyword=${keyword}`)
        const response = await axios.get(url_category, {
            headers: {
                Authorization: `Bearer ${token.access_token}`
            }
        })

        return response.data
    }

    public async generateToken(): Promise<AuthenticateResponse> {
        const base_url = 'https://accounts.tokopedia.com';
        const result = await axios.post( base_url + '/token?grant_type=client_credentials', {}, {
            auth: {
                username: this.clientId,
                password: this.clientSecret
            }
        })

        return result.data
    }
}

// (new TokopediaService()).getCategories()
//     .then((res) => {
//         console.log(res.data.categories)
//     })
//     .catch((err) => {
//         console.log(err)
//     })
