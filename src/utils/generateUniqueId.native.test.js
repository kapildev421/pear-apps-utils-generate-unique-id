import { jest } from '@jest/globals'
import * as Crypto from 'expo-crypto'

import { generateUniqueId } from './generateUniqueId.native'

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const HEX_32_REGEX = /^[0-9a-f]{32}$/i

const originalCrypto = globalThis.crypto

describe('generateUniqueId (native)', () => {
  beforeEach(() => {
    Crypto.randomUUID = jest.fn()
    Crypto.getRandomValues = jest.fn()
  })

  afterEach(() => {
    globalThis.crypto = originalCrypto
    jest.restoreAllMocks()
  })

  it('uses globalThis.crypto.randomUUID when available', () => {
    const mockUuid = 'a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5'
    const randomUUID = jest.fn(() => mockUuid)
    Crypto.randomUUID = undefined
    globalThis.crypto = { randomUUID }

    const id = generateUniqueId()

    expect(id).toBe(mockUuid)
    expect(id).toMatch(UUID_V4_REGEX)
    expect(randomUUID).toHaveBeenCalledTimes(1)
    expect(Crypto.randomUUID).toBeUndefined()
  })

  it('uses Crypto.randomUUID when global randomUUID is absent', () => {
    const mockUuid = 'f1e2d3c4-b5a6-4978-8a6b-5c4d3e2f1a0b'
    globalThis.crypto = {}
    Crypto.randomUUID.mockReturnValue(mockUuid)

    const id = generateUniqueId()

    expect(id).toBe(mockUuid)
    expect(id).toMatch(UUID_V4_REGEX)
    expect(Crypto.randomUUID).toHaveBeenCalledTimes(1)
  })

  it('falls back to getRandomValues when no randomUUID exists', () => {
    globalThis.crypto = {}
    Crypto.randomUUID = undefined
    Crypto.getRandomValues.mockImplementation((bytes) => bytes.fill(0x0a))

    const id = generateUniqueId()

    expect(id).toBe('0a'.repeat(16))
    expect(id).toMatch(HEX_32_REGEX)
    expect(Crypto.getRandomValues).toHaveBeenCalledTimes(1)
  })

  it('throws when no secure RNG is available', () => {
    globalThis.crypto = undefined
    Crypto.randomUUID = undefined
    Crypto.getRandomValues = undefined

    expect(() => generateUniqueId()).toThrow(
      'Secure random generator unavailable'
    )
  })

  describe('skipUUID option', () => {
    it('should skip UUID generation and return hex string when skipUUID is true, even with globalThis.crypto.randomUUID available', () => {
      const mockUuid = 'a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5'
      const randomUUID = jest.fn(() => mockUuid)
      const getRandomValues = jest.fn((bytes) => bytes.fill(0x0a))
      globalThis.crypto = { randomUUID, getRandomValues }
      Crypto.randomUUID = undefined

      const id = generateUniqueId({ skipUUID: true })

      expect(id).toBe('0a'.repeat(16))
      expect(id).toMatch(HEX_32_REGEX)
      expect(id).not.toMatch(UUID_V4_REGEX)
      expect(randomUUID).not.toHaveBeenCalled()
      expect(getRandomValues).toHaveBeenCalledTimes(1)
    })

    it('should skip UUID generation and return hex string when skipUUID is true, even with Crypto.randomUUID available', () => {
      const mockUuid = 'f1e2d3c4-b5a6-4978-8a6b-5c4d3e2f1a0b'
      Crypto.randomUUID = jest.fn(() => mockUuid)
      Crypto.getRandomValues = jest.fn((bytes) => bytes.fill(0x0b))
      globalThis.crypto = undefined

      const id = generateUniqueId({ skipUUID: true })

      expect(id).toBe('0b'.repeat(16))
      expect(id).toMatch(HEX_32_REGEX)
      expect(id).not.toMatch(UUID_V4_REGEX)
      expect(Crypto.randomUUID).not.toHaveBeenCalled()
      expect(Crypto.getRandomValues).toHaveBeenCalledTimes(1)
    })

    it('should still generate unique IDs when skipUUID is true', () => {
      let callCount = 0
      const getRandomValues = jest.fn((bytes) => {
        const value = callCount++
        bytes.fill(value)
      })
      globalThis.crypto = { getRandomValues }
      Crypto.randomUUID = undefined
      Crypto.getRandomValues = undefined

      const id1 = generateUniqueId({ skipUUID: true })
      const id2 = generateUniqueId({ skipUUID: true })

      expect(id1).not.toBe(id2)
      expect(id1).toMatch(HEX_32_REGEX)
      expect(id2).toMatch(HEX_32_REGEX)
    })

    it('should use UUID when skipUUID is false and UUID is available', () => {
      const mockUuid = 'a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5'
      const randomUUID = jest.fn(() => mockUuid)
      Crypto.randomUUID = undefined
      globalThis.crypto = { randomUUID }

      const id = generateUniqueId({ skipUUID: false })

      expect(id).toBe(mockUuid)
      expect(id).toMatch(UUID_V4_REGEX)
      expect(randomUUID).toHaveBeenCalledTimes(1)
    })

    it('should use UUID when skipUUID is not provided and UUID is available', () => {
      const mockUuid = 'f1e2d3c4-b5a6-4978-8a6b-5c4d3e2f1a0b'
      globalThis.crypto = {}
      Crypto.randomUUID.mockReturnValue(mockUuid)

      const id = generateUniqueId()

      expect(id).toBe(mockUuid)
      expect(id).toMatch(UUID_V4_REGEX)
      expect(Crypto.randomUUID).toHaveBeenCalledTimes(1)
    })
  })
})
