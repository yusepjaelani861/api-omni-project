import { Request } from "express"
import { UserProps } from "./user"

export interface RequestAny extends Request {
    user: UserProps
}