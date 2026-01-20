import type {
  ConstantComponentOptions,
  DisplayFormat,
} from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

// Dimensions for constant component
export const CONSTANT_HEIGHT = 30;

function numCharactersToWidth(numCharacters: number) {
  const [a1, a2] = [1, 64];
  const [b1, b2] = [30, 480];
  const t = (numCharacters - a1) / (a2 - a1);
  return t * (b2 - b1) + b1;
}

function getWidth(bitWidth: number, displayFormat: DisplayFormat) {
  switch (displayFormat) {
    case "bin":
      return numCharactersToWidth(bitWidth);
    case "dec":
      return numCharactersToWidth(Math.ceil(bitWidth * Math.log10(2)));
    case "hex":
      return numCharactersToWidth(Math.ceil(bitWidth / 4) + 2);
  }
}

export function getConstantGeometry(
  bitWidth: number,
  displayFormat: DisplayFormat,
) {
  const width = getWidth(bitWidth, displayFormat);
  const height = CONSTANT_HEIGHT;
  const halfW = width / 2;
  const halfH = height / 2;
  return {
    width,
    height,
    // Standard geometry
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
    centerX: 0,
    centerY: 0,
  };
}

export function terminalInfoOfConstant(
  position: Position,
  options: ConstantComponentOptions,
): TerminalInfo[] {
  const geo = getConstantGeometry(options.bitWidth, options.displayFormat);

  return [
    {
      name: "out",
      direction: "out",
      position: {
        x: position.x + geo.rightX,
        y: position.y + geo.centerY,
      },
    },
  ];
}

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
 * Simulate a constant component.
 * @param options The constant component options
 * @returns Map of output terminal name to value
 */
export function simulateConstant(
  options: ConstantComponentOptions,
): Map<string, bigint> {
  const mask = (1n << BigInt(options.bitWidth)) - 1n;
  const outputs = new Map<string, bigint>();
  outputs.set("out", options.value & mask);
  return outputs;
}
