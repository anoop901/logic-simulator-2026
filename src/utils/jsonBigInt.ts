/**
 * JSON utilities that handle BigInt serialization.
 *
 * BigInt values are converted to numbers for JSON (safe for values within
 * Number.MAX_SAFE_INTEGER range).
 */

/**
 * Custom replacer for JSON.stringify that converts BigInt to number.
 */
export function bigIntReplacer(_key: string, value: unknown): unknown {
  if (typeof value === "bigint") {
    return Number(value);
  }
  return value;
}

/**
 * Stringify an object to JSON, handling BigInt values.
 */
export function stringifyWithBigInt(value: unknown): string {
  return JSON.stringify(value, bigIntReplacer);
}
