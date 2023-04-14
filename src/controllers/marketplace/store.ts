import TokopediaService from '../../services/tokopedia.service';
import asyncHandler from '../../middleware/async'
import { NextFunction, Response } from 'express';
import { sendError, sendResponse } from '../../libraries/rest'
import StoreService from '../../services/store.service';
import { body, validationResult } from 'express-validator';

export default class StoreController extends StoreService {
    public storeList = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        const shops = await this.findStores({
            user_id: req.user.id
        }, req);

        return res.json(new sendResponse(shops.data, 'Success get store list', shops.pagination));
    })

    public storeView = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        const { shop_id } = req.params;
        const store = await this.findStore({
            shop_id: shop_id,
            user_id: req.user?.id
        }, req.user?.id);

        return res.json(new sendResponse(store, 'Success get store detail'));
    })

    public storeCreate = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new sendError('Please provide a name, domain, region, status and shop id', errors.array(), 'VALIDATION_ERROR'));
        }
        const {
            name,
            domain,
            region,
            status,
            shop_id,
            shop_type,
        } = req.body

        const cek = await this.findStore({
            shop_id: shop_id,
        }, req)

        if (cek) {
            return next(new sendError('Store already exist', [], 'PROCESS_ERROR'));
        }

        const store = await this.createStore({
            name: name,
            domain: domain,
            region: region,
            status: status,
            shop_id: shop_id,
            user_id: req.user.id,
            shop_type: shop_type,
        })

        return res.json(new sendResponse(store, 'Success create store'));
    })

    public validation = (method: string) => {
        switch (method) {
            case 'storeCreate': {
                return [
                    body('name').notEmpty().withMessage('Name is required'),
                    body('domain').notEmpty().withMessage('Domain is required'),
                    body('region').notEmpty().withMessage('Region is required'),
                    body('status').notEmpty().withMessage('Status is required')
                        .isBoolean().withMessage('Status must be boolean'),
                    body('shop_id').notEmpty().withMessage('Shop id is required')
                        .isInt().withMessage('Shop id must be integer'),
                    body('shop_type').notEmpty().withMessage('Shop type is required')
                        .isIn(['tokopedia', 'shopee', 'lazada', 'tiktok']).withMessage('Shop type must be tokopedia, shopee, lazada or tiktok'),
                ]
            }

            default: {
                return [];
            }
        }
    }
}