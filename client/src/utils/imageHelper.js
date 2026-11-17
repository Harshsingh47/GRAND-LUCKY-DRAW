import posterFallback from '../assets/grand-lucky-draw-poster.jpg';

/**
 * Resolves an image URL whether relative, absolute, or hosted on backend.
 */
export const resolveImageUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return posterFallback;
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && url.startsWith('/uploads')) {
    return `${apiUrl.replace(/\/$/, '')}${url}`;
  }

  return url;
};

/**
 * Robust onError image fallback handler
 */
export const handleImageError = (e) => {
  if (e && e.currentTarget) {
    e.currentTarget.onerror = null; // Prevent recursion
    e.currentTarget.src = posterFallback;
  }
};

export default {
  resolveImageUrl,
  handleImageError,
  posterFallback
};
