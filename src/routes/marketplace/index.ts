import express from 'express'
import MarketplaceController from '../../controllers/marketplace'
import { protect } from '../../middleware/auth'

const router = express.Router()

const marketplace = new MarketplaceController()

router
    .route('/tokopedia/product/shop')
    .get(protect, marketplace.tokopedia.productShop)

router
    .route('/store')
    .get(protect, marketplace.store.storeList)

router
    .route('/store/:shop_id')
    .get(protect, marketplace.store.storeView)

router
    .route('/store')
    .post(protect, marketplace.store.validation('storeCreate'), marketplace.store.storeCreate)

export default router