import type { DisplayFormat } from "../types/LogicComponent";

export const DISPLAY_FORMAT_OPTIONS = [
  { value: "hex", label: "Hexadecimal" },
  { value: "dec", label: "Decimal" },
  { value: "bin", label: "Binary" },
];

/**
 * Format a value according to display format and bit width.
 */
export function formatValue(
  value: bigint,
  bitWidth: number,
  displayFormat: DisplayFormat,
): string {
  // Mask the value to the bit width using BigInt
  const mask = (1n << BigInt(bitWidth)) - 1n;
  const maskedValue = value & mask;

  switch (displayFormat) {
    case "bin":
      return maskedValue.toString(2).padStart(bitWidth, "0");
    case "dec":
      return maskedValue.toString(10);
    case "hex": {
      const hexDigits = Math.ceil(bitWidth / 4);
      return (
        "0x" + maskedValue.toString(16).toUpperCase().padStart(hexDigits, "0")
      );
    }
  }
}

/**
 * Parse a string value according to display format and bit width.
 * Returns null if the input is empty, negative, exceeds the bit width, or is otherwise invalid.
 */
export function parseValue(
  input: string,
  displayFormat: DisplayFormat,
  bitWidth: number,
): bigint | null {
  try {
    let parsed: bigint;
    const trimmed = input.trim();

    if (trimmed === "") {
      return null;
    }

    switch (displayFormat) {
      case "bin":
        parsed = BigInt("0b" + trimmed);
        break;
      case "dec":
        parsed = BigInt(trimmed);
        break;
      case "hex": {
        const hexStr = trimmed.replace(/^0x/i, "");
        parsed = BigInt("0x" + hexStr);
        break;
      }
    }

    if (parsed < 0n) {
      return null;
    }

    const maxValue = (1n << BigInt(bitWidth)) - 1n;
    if (parsed > maxValue) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
