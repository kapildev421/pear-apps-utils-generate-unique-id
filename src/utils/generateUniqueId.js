/**
 * Generates a cryptographically secure random identifier.
 * NOT intended for authentication, authorization, or secrets.
 *
 * @param {Object} options - Configuration options.
 * @param {boolean} [options.skipUUID=false] - If true, skips UUID generation and always returns a hex string.
 * @returns {string} A UUID v4 string if supported, otherwise a 32-char hex string.
 * @throws {Error} If a secure random generator is unavailable.
 */
export const generateUniqueId = (options = {}) => {
  const { skipUUID = false } = options
  const crypto = globalThis.crypto
  if (!crypto) {
    throw new Error('Secure random generator unavailable')
  }
  if (!skipUUID && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  // keep hex-only format (no UUID bits)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}
