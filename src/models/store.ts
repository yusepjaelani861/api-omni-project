import Pagination from "../interfaces/pagination";

export interface Store {
    id: string;
    user_id: string;
    shop_id: number;
    shop_type: string;
    name: string;
    domain: string;
    region: string;
    status: boolean;
    authorization_time?: Date | null;
    created_at: Date;
    updated_at: Date;
}

export interface StoreResponse {
    data: Store[],
    pagination: Pagination
}

export interface InputStore {
    user_id: string
    shop_id: number
    shop_type: string
    name: string
    domain: string
    region: string
    status?: boolean
    authorization_time?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
}