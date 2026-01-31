import express from 'express';
import previousWorkRouter from './previousWork.js';

const router = express.Router();

router.use('/', previousWorkRouter);

export default router;
