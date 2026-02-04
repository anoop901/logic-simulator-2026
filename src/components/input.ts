import type {
  InputComponentOptions,
  DisplayFormat,
} from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";
import numberOptionsToComponentWidth from "../utils/numberOptionsToComponentWidth";

// Dimensions for input component
export const INPUT_HEIGHT = 30;

export function getInputGeometry(
  bitWidth: number,
  displayFormat: DisplayFormat,
) {
  const width = numberOptionsToComponentWidth(bitWidth, displayFormat);
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
