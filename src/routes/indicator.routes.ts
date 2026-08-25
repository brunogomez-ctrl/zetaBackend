import { Router } from 'express';
import { postIndicatorValues } from '../controllers/indicator.controller';

const router = Router();
router.post('/:idOrName/values', postIndicatorValues);
export default router;