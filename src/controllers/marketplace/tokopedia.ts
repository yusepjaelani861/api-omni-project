import TokopediaService from '../../services/tokopedia.service';
import asyncHandler from '../../middleware/async'
import { NextFunction, Response } from 'express';
import { sendError, sendResponse } from '../../libraries/rest'

export default class TokopediaController extends TokopediaService {
    public productShop = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        if (!req.query.shop_id) {
            return next(new sendError('Shop id is required', [], 'VALIDATION_ERROR'));
        }
        const products = await this.getProductByShop({
            shop_id: parseInt(req.query.shop_id),
            page: req.query.page ? parseInt(req.query.page) : 1,
            per_page: req.query.limit ? parseInt(req.query.limit) : 10,
        }, req.user?.id);

        return res.json(new sendResponse(products, 'Success get product by shop'));
    })
}