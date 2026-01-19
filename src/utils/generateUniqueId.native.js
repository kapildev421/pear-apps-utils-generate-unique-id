import * as Crypto from 'expo-crypto'

/**
 * Generates a cryptographically secure random identifier for React Native.
 * NOT intended for authentication, authorization, or secrets.
 * Output format is stable and deterministic.
 *
 * @param {Object} options - Configuration options.
 * @param {boolean} [options.skipUUID=false] - If true, skips UUID generation and always returns a hex string.
 * @returns {string} A UUID v4 string when supported, otherwise a 32-char hex string.
 * @throws {Error} When a secure random generator is unavailable.
 */
export const generateUniqueId = (options = {}) => {
  const { skipUUID = false } = options

  if (!skipUUID) {
    if (Crypto.randomUUID) return Crypto.randomUUID()
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  }

  const getRandomValues =
    globalThis.crypto?.getRandomValues || Crypto.getRandomValues
  if (getRandomValues) {
    const bytes = new Uint8Array(16)
    getRandomValues(bytes)
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  }

  throw new Error('Secure random generator unavailable')
}
