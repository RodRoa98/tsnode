import { Router } from 'express';

import health from './health/health.route';

const router: Router = Router();

router.use('/health', health);

export default router;
