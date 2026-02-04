import { API_STORAGE_URL } from '../services/api';

const placeholderSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'><rect fill='#f3f4f6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23cbd5e1' font-size='36' font-family='Arial, Helvetica, sans-serif'>Image</text></svg>`;
export const PLACEHOLDER_DATA_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(placeholderSvg)}`;

export const getImageUrl = (item: any): string => {
  // Handle cases where item itself is the product or contains product
  const prod: any = item?.product || item || {};

  // Collect all possible image sources
  const candidates: Array<any> = [
    item?.image,
    item?.imageUrl,
    item?.image_url,
    item?.main_image_url,
    item?.mainImageUrl,
    prod?.image,
    prod?.imageUrl,
    prod?.image_url,
    prod?.main_image_url,
    prod?.mainImageUrl
  ];

  if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
    const img = prod.images[0];
    candidates.push(img?.image_url, img?.url, img?.path, (img as any)?.imageUrl);
  }

  // prefer absolute URL
  for (const c of candidates) {
    if (!c) continue;
    const s = String(c).trim();
    if (!s) continue;
    // Check for standard protocols
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    // Check for storage data which might be full URL
    if (s.startsWith('data:')) return s;
  }

  // transform relative/storage paths to absolute using API_STORAGE_URL
  for (const c of candidates) {
    if (!c) continue;
    let s = String(c).trim();
    if (!s) continue;

    // Clean up leading slashes
    s = s.replace(/^\/+/, '');

    // If it's a storage path, prepend storage URL
    if (s.startsWith('storage/')) {
      return `${API_BASE_URL.replace('/api', '')}/${s}`; // Fallback if API_STORAGE_URL isn't perfect
    }

    return `${API_STORAGE_URL}/${s}`;
  }

  // final fallback to inline SVG data URI to avoid network 404s
  return PLACEHOLDER_DATA_URI;
};

export default getImageUrl;
