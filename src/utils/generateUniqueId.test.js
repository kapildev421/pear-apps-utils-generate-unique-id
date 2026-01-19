import { webcrypto } from 'node:crypto'

import { generateUniqueId } from './generateUniqueId'

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const HEX_32_REGEX = /^[0-9a-f]{32}$/i

beforeAll(() => {
  if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = webcrypto
  }
})

describe('generateUniqueId', () => {
  it('should return a string', () => {
    const id = generateUniqueId()
    expect(typeof id).toBe('string')
  })

  it('should generate unique IDs', () => {
    const id1 = generateUniqueId()
    const id2 = generateUniqueId()
    expect(id1).not.toBe(id2)
  })

  it('prefers randomUUID when available (UUID v4 shape)', () => {
    const id = generateUniqueId()
    // In environments with randomUUID, expect UUID format.
    expect(id.length).toBeGreaterThan(0)
    if (globalThis.crypto?.randomUUID) {
      expect(id).toMatch(UUID_V4_REGEX)
    }
  })

  it('falls back to hex when randomUUID is unavailable but getRandomValues exists', () => {
    const originalRandomUUID = globalThis.crypto.randomUUID
    const getRandomValuesSpy = jest.spyOn(globalThis.crypto, 'getRandomValues')

    globalThis.crypto.randomUUID = undefined
    const id = generateUniqueId()

    expect(id).toMatch(HEX_32_REGEX)
    expect(getRandomValuesSpy).toHaveBeenCalled()

    globalThis.crypto.randomUUID = originalRandomUUID
    getRandomValuesSpy.mockRestore()
  })

  it('throws if crypto is unavailable', () => {
    const originalCrypto = globalThis.crypto
    globalThis.crypto = undefined

    expect(() => generateUniqueId()).toThrow(
      'Secure random generator unavailable'
    )

    globalThis.crypto = originalCrypto
  })

  describe('skipUUID option', () => {
    it('should skip UUID generation and return hex string when skipUUID is true', () => {
      const getRandomValuesSpy = jest.spyOn(globalThis.crypto, 'getRandomValues')
      const id = generateUniqueId({ skipUUID: true })

      expect(id).toMatch(HEX_32_REGEX)
      expect(id).not.toMatch(UUID_V4_REGEX)
      expect(getRandomValuesSpy).toHaveBeenCalled()

      getRandomValuesSpy.mockRestore()
    })

    it('should still generate unique IDs when skipUUID is true', () => {
      const id1 = generateUniqueId({ skipUUID: true })
      const id2 = generateUniqueId({ skipUUID: true })
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(HEX_32_REGEX)
      expect(id2).toMatch(HEX_32_REGEX)
    })

    it('should use UUID when skipUUID is false and UUID is available', () => {
      if (globalThis.crypto?.randomUUID) {
        const id = generateUniqueId({ skipUUID: false })
        expect(id).toMatch(UUID_V4_REGEX)
      }
    })

    it('should use UUID when skipUUID is not provided and UUID is available', () => {
      if (globalThis.crypto?.randomUUID) {
        const id = generateUniqueId()
        expect(id).toMatch(UUID_V4_REGEX)
      }
    })
  })
})
