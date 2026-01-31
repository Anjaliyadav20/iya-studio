import Service from '../models/Service.js';

// Get all services (public - only active for frontend; admin gets all via same endpoint and filters)
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

const MAX_IMAGE_LENGTH = 4 * 1024 * 1024; // ~4MB base64 (roughly 2–3MB image)

// Create service
export const createService = async (req, res) => {
  try {
    const { name, description, service_type, price_range, image_url, features, is_active } = req.body;
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName || !service_type) {
      return res.status(400).json({ error: 'Name and service type are required' });
    }
    if (image_url && typeof image_url === 'string' && image_url.startsWith('data:') && image_url.length > MAX_IMAGE_LENGTH) {
      return res.status(400).json({ error: 'Image too large. Please use a smaller image (under 2MB) or paste an image URL instead.' });
    }

    const service = new Service({
      name: trimmedName,
      description: description || '',
      service_type,
      price_range: price_range || '',
      image_url: image_url || '',
      features: Array.isArray(features) ? features : [],
      is_active: is_active !== false,
    });
    await service.save();
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    console.error('Create service error:', error);
    if (error.name === 'ValidationError') {
      const msg = Object.values(error.errors).map((e) => e.message).join(' ') || error.message;
      return res.status(400).json({ error: msg });
    }
    res.status(500).json({ error: error.message || 'Failed to create service' });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price_range, image_url, features, is_active } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (price_range !== undefined) update.price_range = price_range;
    if (image_url !== undefined) update.image_url = image_url;
    if (features !== undefined) update.features = Array.isArray(features) ? features : [];
    if (is_active !== undefined) update.is_active = is_active;

    const service = await Service.findByIdAndUpdate(id, update, { new: true });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

// Toggle service active status
export const toggleServiceActive = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    service.is_active = !service.is_active;
    await service.save();

    res.json({ message: 'Service status updated successfully', service });
  } catch (error) {
    console.error('Toggle service error:', error);
    res.status(500).json({ error: 'Failed to toggle service status' });
  }
};
