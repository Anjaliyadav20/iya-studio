import Gallery from '../models/Gallery.js';

// Get all gallery items
export const getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};



// Add gallery item
export const addGalleryItem = async (req, res) => {
  try {
    const { title, description, media_urls, media_type, service_type, is_featured, event_type, location } = req.body;

    const trimmedTitle = typeof title === 'string' ? title.trim() : '';
    if (!trimmedTitle) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Handle both array and single URL for backward compatibility
    let urlsArray = [];
    if (Array.isArray(media_urls)) {
      urlsArray = media_urls.filter(url => url && typeof url === 'string');
    } else if (media_urls && typeof media_urls === 'string') {
      urlsArray = [media_urls];
    }

    if (urlsArray.length === 0) {
      return res.status(400).json({ error: 'At least one media URL is required' });
    }

    const itemData = {
      title: trimmedTitle,
      description: description || '',
      media_urls: urlsArray,
      media_type: media_type === 'video' ? 'video' : 'image',
      is_featured: !!is_featured,
      event_type: event_type || 'other',
      location: location || '',
      service_type: service_type || undefined,
    };

    const item = new Gallery(itemData);
    await item.save();

    res.status(201).json({
      message: 'Gallery item added successfully',
      itemId: item._id,
    });
  } catch (error) {
    console.error('Add gallery error:', error);
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map((e) => e.message).join(' ') || error.message;
      return res.status(400).json({ error: msg });
    }
    res.status(500).json({ error: error.message || 'Failed to add gallery item' });
  }
};

// Delete gallery item
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Gallery.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
};
