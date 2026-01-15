import type { MuxComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

const MUX_WIDTH = 50;
const BASE_HEIGHT = 50;
const INPUT_SPACING = 15;
export const TRAPEZOID_INSET = 10;

// Shared coordinate calculations (center-origin)
export function getMuxGeometry(selectBits: number) {
  const numInputs = Math.pow(2, selectBits);
  const height = Math.max(BASE_HEIGHT, numInputs * INPUT_SPACING + 20);
  const halfW = MUX_WIDTH / 2;
  const halfH = height / 2;

  // Calculate input Y positions relative to center
  const totalInputHeight = (numInputs - 1) * INPUT_SPACING;
  const inputYPositions: number[] = [];
  for (let i = 0; i < numInputs; i++) {
    inputYPositions.push(-totalInputHeight / 2 + i * INPUT_SPACING);
  }

  return {
    numInputs,
    height,
    halfW,
    halfH,
    inputYPositions,
    // Key positions
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
  };
}

export function terminalInfoOfMux(
  position: Position,
  options: MuxComponentOptions
): TerminalInfo[] {
  const { selectBits } = options;
  const geo = getMuxGeometry(selectBits);

  const result: TerminalInfo[] = [];

  // Data inputs (left side)
  for (let i = 0; i < geo.numInputs; i++) {
    result.push({
      name: `in${i}`,
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.inputYPositions[i],
      },
    });
  }

  // Select input (bottom)
  result.push({
    name: "sel",
    direction: "in",
    position: {
      x: position.x,
      y: position.y + geo.bottomY - TRAPEZOID_INSET / 2,
    },
  });

  // Output (right side)
  result.push({
    name: "out",
    direction: "out",
    position: {
      x: position.x + geo.rightX,
      y: position.y,
    },
  });

  return result;
}
