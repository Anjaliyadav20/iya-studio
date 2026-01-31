import express from 'express';
import { getGallery, addGalleryItem, deleteGalleryItem } from './gallery.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getGallery);
router.post('/', authenticateToken, addGalleryItem);
router.delete('/:id', authenticateToken, deleteGalleryItem);

export default router;
