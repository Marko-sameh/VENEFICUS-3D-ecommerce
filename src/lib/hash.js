/**
 * Complex hash utility for product IDs using Hashids
 */
import Hashids from 'hashids';

// Create hashids instance with custom salt and minimum length
const hashids = new Hashids('veneficus-salt-2024', 8, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');

// Encode product ID to complex hash
export const hashId = (id) => {
  return hashids.encode(parseInt(id));
};

// Decode hash back to product ID
export const unhashId = (hash) => {
  const decoded = hashids.decode(hash);
  return decoded.length > 0 ? decoded[0].toString() : hash;
};