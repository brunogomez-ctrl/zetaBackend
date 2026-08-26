import { Router } from 'express';
import { getGeoLocationChildren } from '../controllers/geo-location.controller';

const router = Router();
router.get('/', getGeoLocationChildren);
export default router;
