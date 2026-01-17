import type { NotComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

export const NOT_TRIANGLE_WIDTH = 40;
const NOT_TRIANGLE_HEIGHT = 30;
export const BUBBLE_RADIUS = 5;

// Shared coordinate calculations (center-origin)
export function getNotGeometry() {
  const halfW = NOT_TRIANGLE_WIDTH / 2;
  const halfH = NOT_TRIANGLE_HEIGHT / 2;
  return {
    halfW,
    halfH,
    // Triangle vertices relative to center
    triangleLeftX: -halfW,
    triangleRightX: halfW,
    triangleTopY: -halfH,
    triangleBottomY: halfH,
    // Bubble position
    bubbleX: halfW + BUBBLE_RADIUS,
    bubbleRightX: halfW + 2 * BUBBLE_RADIUS,
    // Total width including bubble
    totalWidth: NOT_TRIANGLE_WIDTH + BUBBLE_RADIUS * 2,
  };
}

export function terminalInfoOfNot(
  position: Position,
  _options: NotComponentOptions
): TerminalInfo[] {
  const geo = getNotGeometry();

  return [
    {
      name: "in",
      direction: "in",
      position: {
        x: position.x + geo.triangleLeftX,
        y: position.y,
      },
    },
    {
      name: "out",
      direction: "out",
      position: {
        x: position.x + geo.bubbleRightX,
        y: position.y,
      },
    },
  ];
}

/**
 * Simulate a NOT gate component.
 * @param options The NOT component options
 * @param inputs Map of input terminal names to values ("in")
 * @returns Map of output terminal name to value
 */
export function simulateNot(
  options: NotComponentOptions,
  inputs: Map<string, bigint>
): Map<string, bigint> {
  const { bitWidth } = options;
  const mask = (1n << BigInt(bitWidth)) - 1n;
  const input = inputs.get("in") ?? 0n;

  const outputs = new Map<string, bigint>();
  outputs.set("out", ~input & mask);
  return outputs;
}
