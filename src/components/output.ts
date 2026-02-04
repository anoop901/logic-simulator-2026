import type {
  DisplayFormat,
  OutputComponentOptions,
} from "../types/LogicComponent";
import type Position from "../types/Position";
import numberOptionsToComponentWidth from "../utils/numberOptionsToComponentWidth";
import type { TerminalInfo } from "./terminalInfoOfComponent";

export const OUTPUT_HEIGHT = 30;

export function getOutputGeometry(
  bitWidth: number,
  displayFormat: DisplayFormat,
) {
  const width = numberOptionsToComponentWidth(bitWidth, displayFormat);
  const height = OUTPUT_HEIGHT;
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

export function terminalInfoOfOutput(
  position: Position,
  options: OutputComponentOptions,
): TerminalInfo[] {
  const geo = getOutputGeometry(options.bitWidth, options.displayFormat);
  return [
    {
      name: "in",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.centerY,
      },
    },
  ];
}

export function simulateOutput(
  _options: OutputComponentOptions,
  _inputs: Map<string, bigint>,
): Map<string, bigint> {
  return new Map<string, bigint>();
}
