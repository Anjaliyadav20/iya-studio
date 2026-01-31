import express from 'express';
import { getServices, createService, updateService, toggleServiceActive } from './services.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getServices);
router.post('/', authenticateToken, createService);
router.patch('/:id', authenticateToken, updateService);
router.patch('/:id/toggle', authenticateToken, toggleServiceActive);

export default router;
