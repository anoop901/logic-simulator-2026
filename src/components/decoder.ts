import type { DecoderComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

const DECODER_WIDTH = 50;
const BASE_HEIGHT = 50;
const OUTPUT_SPACING = 15;
export const TRAPEZOID_INSET = 10;

// Shared coordinate calculations (center-origin)
export function getDecoderGeometry(inputBits: number) {
  const numOutputs = Math.pow(2, inputBits);
  const height = Math.max(BASE_HEIGHT, numOutputs * OUTPUT_SPACING + 20);
  const halfW = DECODER_WIDTH / 2;
  const halfH = height / 2;

  // Calculate output Y positions relative to center
  const totalOutputHeight = (numOutputs - 1) * OUTPUT_SPACING;
  const outputYPositions: number[] = [];
  for (let i = 0; i < numOutputs; i++) {
    outputYPositions.push(-totalOutputHeight / 2 + i * OUTPUT_SPACING);
  }

  return {
    numOutputs,
    height,
    halfW,
    halfH,
    outputYPositions,
    // Key positions
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
  };
}

export function terminalInfoOfDecoder(
  position: Position,
  options: DecoderComponentOptions
): TerminalInfo[] {
  const { inputBits } = options;
  const geo = getDecoderGeometry(inputBits);

  const result: TerminalInfo[] = [];

  // Input (left side, center)
  result.push({
    name: "in",
    direction: "in",
    position: {
      x: position.x + geo.leftX,
      y: position.y,
    },
  });

  // Outputs (right side)
  for (let i = 0; i < geo.numOutputs; i++) {
    result.push({
      name: `out${i}`,
      direction: "out",
      position: {
        x: position.x + geo.rightX,
        y: position.y + geo.outputYPositions[i],
      },
    });
  }

  return result;
}
