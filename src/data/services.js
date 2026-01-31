
// Load images from `src/assets/` and map by filename to ensure correct images
const imageModules = import.meta.glob('../assets/*.{jpg,jpeg,png,webp}', { eager: true });
const imageMap = {};

Object.keys(imageModules).forEach((k) => {
    // k is like '../assets/filename.jpg'
    const parts = k.split('/');
    const name = parts[parts.length - 1];
    imageMap[name] = imageModules[k].default || imageModules[k];
});

/**
 * Resolves an image path from the backend.
 * If it's a local filename (e.g. "neon.jpeg"), maps it to the imported asset.
 * If it's a URL, returns it as is.
 */
export const resolveLocalImage = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) return url;

    // Try to find in local map
    return imageMap[url] || url;
};

// Deprecated: staticServices array removed as data is now in MongoDB
