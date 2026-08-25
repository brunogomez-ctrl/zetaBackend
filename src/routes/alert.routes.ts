import { Router } from 'express';
import { postAlertValues } from '../controllers/alert.controller';

const router = Router();
router.post('/:idOrName/values', postAlertValues);
export default router;
