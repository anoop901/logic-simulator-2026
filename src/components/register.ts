import type { RegisterComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

const REGISTER_WIDTH_SINGLE_BIT = 50;
const REGISTER_WIDTH_MULTIBIT = 80;
export const REGISTER_HEIGHT = 40;

// Shared coordinate calculations (center-origin)
export function getRegisterGeometry(bitWidth: number) {
  const multiBit = bitWidth > 1;
  const width = multiBit ? REGISTER_WIDTH_MULTIBIT : REGISTER_WIDTH_SINGLE_BIT;
  const halfW = width / 2;
  const halfH = REGISTER_HEIGHT / 2;

  return {
    width,
    halfW,
    halfH,
    multiBit,
    bitWidth,
    // Key positions
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
  };
}

export function terminalInfoOfRegister(
  position: Position,
  options: RegisterComponentOptions
): TerminalInfo[] {
  const geo = getRegisterGeometry(options.bitWidth);

  return [
    // Data input (left)
    {
      name: "d",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y,
      },
    },
    // Data output (right)
    {
      name: "q",
      direction: "out",
      position: {
        x: position.x + geo.rightX,
        y: position.y,
      },
    },
  ];
}
