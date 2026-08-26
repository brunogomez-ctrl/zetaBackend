import { Router } from 'express';
import { getLogicalLocationChildren } from '../controllers/logical-location.controller';

const router = Router();
router.get('/', getLogicalLocationChildren);
export default router;
