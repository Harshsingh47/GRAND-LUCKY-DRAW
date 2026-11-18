import posterFallback from '../assets/grand-lucky-draw-poster.jpg';
import fortunerImg from '../assets/toyota-fortuner.png';
import tharImg from '../assets/mahindra-thar.png';
import swiftImg from '../assets/maruti-swift.png';

/**
 * Resolves an image URL whether relative, absolute, or hosted on backend.
 * Automatically maps specific prize names (Fortuner, Thar, Swift) to local high-res studio assets.
 */
export const resolveImageUrl = (url, prizeName = '') => {
  const name = String(prizeName || '').toLowerCase();

  // Smart vehicle image matching
  if (name.includes('fortuner')) return fortunerImg;
  if (name.includes('thar')) return tharImg;
  if (name.includes('swift')) return swiftImg;

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
    e.currentTarget.onerror = null; // Prevent infinite recursion
    e.currentTarget.src = posterFallback;
  }
};

export default {
  resolveImageUrl,
  handleImageError,
  posterFallback,
  fortunerImg,
  tharImg,
  swiftImg
};
