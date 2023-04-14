import { ObjectId } from "mongodb"

enum conditionProduct {
    new = 1,
    used = 2,
}

enum statusProduct {
    banned = -2,
    pending = -1,
    deleted = 0,
    archived = 1,
    best = 2,
    inactive = 3,
}

enum unitProduct {
    gram = 1,
    kilogram = 2,
}

type productCategoryTree = {
    id: number,
    Name: string,
    title: string,
    breadcrumbURL: string,
}

type productPicture = {
    picID: number,
    fileName: string,
    filePath: string,
    status: number,
    originalURL: string,
    thumbnailURL: string,
    width: number,
    height: number,
    URL300: string,
}

type productWarehouse = {
    productID: number,
    warehouseID: number,
    price: {
        value: number,
        currency: string,
        LastUpdateUnix: number,
        idr: number,
    },
    stock: {
        useStock: boolean,
        value: number,
    }
}

export default class Product {
    constructor(
        public shopID: number,
        public productID: number,
        public basic: {
            productID: number,
            shopID: number,
            status: statusProduct,
            Name: string,
            condition: conditionProduct,
            childCategoryID: number,
            shortDesc: string,
        },
        public price: {
            value: number,
            currency: string,
            LastUpdateUnix: number,
            idr: number,
        },
        public weight: {
            value: number,
            unit: unitProduct
        },
        public stock: {
            useStock: boolean,
            value: number,
            stockWording?: string | null
        },
        public main_stock: number,
        public variant: {
            isParent: boolean,
            isVariant: boolean,
            childrenID: number[],
        },
        public extraAttribute: {
            minOrder: number,
            lastUpdateCategory: number,
            isEligibleCOD: boolean,
            isOnCampaign: boolean,
        },
        public other?: {
            sku?: string,
            url?: string,
            mobileURL?: string,
        },
        public campaign?: {
            StartDate?: Date,
            EndDate?: Date,
        },
        public wholesale?: {
            price: {
                value: number,
                currency: string,
                idr: number,
            },
            minQuantity: number,
            maxQuantity: number,
        },
        public menu?: {
            id: number,
            Name: string,
        },
        public preorder?: {
            duration: boolean,
            timeUnit: number,
            day: number,
        },
        public GMStats?: {
            transactionSuccess: number,
            transactionReject: number,
            countSold: number,
        },
        public stats?: {
            countView: number,
        },
        public categoryTree?: productCategoryTree[],
        public pictures?: productPicture[],
        public warehouses?: productWarehouse[],
        public reserve_stock?: number,
        public id?: ObjectId,
    ) { }
}