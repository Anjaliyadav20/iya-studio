import express from 'express';
import PreviousWork from '../models/PreviousWork.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Fetch all previous work items
// @route   GET /api/previous-work
// @access  Public
router.get('/', async (req, res) => {
    try {
        const items = await PreviousWork.find({}).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Create a previous work item
// @route   POST /api/previous-work
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { title, description, media_urls, media_type, service_type, event_type, location, is_featured, event_date } = req.body;

        const item = new PreviousWork({
            title,
            description,
            media_urls,
            media_type,
            service_type,
            event_type,
            location,
            is_featured,
            event_date,
        });

        const createdItem = await item.save();
        console.log(`✅ Success: Previous work item created: ${createdItem._id}`);
        res.status(201).json(createdItem);
    } catch (error) {
        console.error(`❌ Error creating work item:`, error);
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// @desc    Delete a previous work item
// @route   DELETE /api/previous-work/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const item = await PreviousWork.findById(req.params.id);
        if (item) {
            await item.deleteOne();
            res.json({ message: 'Item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

export default router;
