import express from "express";
import user from './user'
import marketplace from './marketplace'

const router = express.Router()

router.use('/', user)
router.use('/', marketplace)

export default router;