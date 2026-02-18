import { describe, it, expect } from 'vitest';
import { hexToDecimal, md5HexToDecimalList, generateMD5Hash } from './md5';

describe('hexToDecimal', () => {
  it('converts ff to 255', () => {
    expect(hexToDecimal('ff')).toBe(255);
  });

  it('converts 00 to 0', () => {
    expect(hexToDecimal('00')).toBe(0);
  });

  it('converts 0a to 10', () => {
    expect(hexToDecimal('0a')).toBe(10);
  });

  it('converts 10 to 16', () => {
    expect(hexToDecimal('10')).toBe(16);
  });
});

describe('md5HexToDecimalList', () => {
  it('converts hex string to list of decimal values', () => {
    expect(md5HexToDecimalList('ff00')).toEqual([255, 0]);
  });

  it('converts each 2-char hex pair independently', () => {
    expect(md5HexToDecimalList('0a0b')).toEqual([10, 11]);
  });

  it('returns empty array for empty string', () => {
    expect(md5HexToDecimalList('')).toEqual([]);
  });
});

describe('generateMD5Hash', () => {
  it('returns a string', () => {
    expect(typeof generateMD5Hash('hello')).toBe('string');
  });

  it('is deterministic - same input gives same output', () => {
    expect(generateMD5Hash('test')).toBe(generateMD5Hash('test'));
  });

  it('returns different hashes for different inputs', () => {
    expect(generateMD5Hash('hello')).not.toBe(generateMD5Hash('world'));
  });

  it('handles empty string without throwing', () => {
    expect(() => generateMD5Hash('')).not.toThrow();
  });
});
