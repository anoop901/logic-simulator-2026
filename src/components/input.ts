import type {
  InputComponentOptions,
  DisplayFormat,
} from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

// Dimensions for input component
export const INPUT_HEIGHT = 30;

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

export function getInputGeometry(
  bitWidth: number,
  displayFormat: DisplayFormat,
) {
  const width = getWidth(bitWidth, displayFormat);
  const height = INPUT_HEIGHT;
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

export function terminalInfoOfInput(
  position: Position,
  options: InputComponentOptions,
): TerminalInfo[] {
  const geo = getInputGeometry(options.bitWidth, options.displayFormat);

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
 * Simulate an input component.
 * @param options The input component options
 * @returns Map of output terminal name to value
 */
export function simulateInput(
  options: InputComponentOptions,
): Map<string, bigint> {
  const mask = (1n << BigInt(options.bitWidth)) - 1n;
  const outputs = new Map<string, bigint>();
  outputs.set("out", options.value & mask);
  return outputs;
}
