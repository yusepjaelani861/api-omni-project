import { NextFunction } from "express";
import { RequestAny } from "../interfaces/request";
import { sendError, sendResponse } from "../libraries/rest";
import { UserModel } from "../models/user";
import { RoleModel } from "../models/role";

class Controllers {
    // protected static sendError(message: string, errors: any, status: string) {
    //     return new sendError(message, errors, status);
    // }

    // protected static sendResponse(data: any, message: string, pagination: any) {
    //     return new sendResponse(data, message, pagination)
    // }

    public user = new UserModel();
    public role = new RoleModel();

    public sendError = sendError
    public sendResponse = sendResponse
}

export default Controllers