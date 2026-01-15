import type { GateComponentOptions, GateType } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

export const GATE_WIDTH = 60;
const INPUT_SPACING = 15;

export const OR_CURVATURE = 0.3;
export const XOR_CURVE_OFFSET = 8;
export const BUBBLE_RADIUS = 5;
const CURVE_PROPORTION = 0.5;

// Check if gate type needs a bubble (inversion)
export function hasInversionBubble(type: GateType): boolean {
  return type === "NAND" || type === "NOR" || type === "XNOR";
}

// Check if gate type needs XOR extra curve
export function hasXorCurve(type: GateType): boolean {
  return type === "XOR" || type === "XNOR";
}

// Check if gate type has curved left edge
function hasCurvedLeftEdge(type: GateType): boolean {
  return type === "OR" || type === "NOR" || type === "XOR" || type === "XNOR";
}

// Compute x-coordinate on the OR gate's left bezier curve at a given y (in center-origin)
// For quadratic bezier: y(t) = -halfH + t * height, we need to solve for t
function getLeftCurveXOffset(inputY: number, halfH: number): number {
  // Convert center-origin y to t (0 to 1)
  const t = (inputY + halfH) / (2 * halfH);
  return 2 * (1 - t) * t * GATE_WIDTH * OR_CURVATURE;
}

// Shared coordinate calculations (center-origin)
export function getGateGeometry(type: GateType, numberOfInputs: number) {
  const height = numberOfInputs * INPUT_SPACING + 16;
  const halfW = GATE_WIDTH / 2;
  const halfH = height / 2;

  // Calculate input Y positions relative to center
  const totalInputHeight = (numberOfInputs - 1) * INPUT_SPACING;
  const inputYPositions: number[] = [];
  for (let i = 0; i < numberOfInputs; i++) {
    inputYPositions.push(-totalInputHeight / 2 + i * INPUT_SPACING);
  }

  // Calculate input X positions (accounting for curved left edge)
  const inputXPositions: number[] = [];
  for (let i = 0; i < numberOfInputs; i++) {
    let xOffset = -halfW;
    if (hasCurvedLeftEdge(type)) {
      xOffset = -halfW + getLeftCurveXOffset(inputYPositions[i], halfH);
      if (hasXorCurve(type)) {
        xOffset -= XOR_CURVE_OFFSET;
      }
    }
    inputXPositions.push(xOffset);
  }

  const bubbleOffset = hasInversionBubble(type) ? BUBBLE_RADIUS * 2 : 0;

  const curveStartX = halfW - CURVE_PROPORTION * GATE_WIDTH;

  return {
    height,
    halfW,
    halfH,
    inputYPositions,
    inputXPositions,
    // Key positions
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
    curveStartX,
    outputX: halfW + bubbleOffset,
  };
}

export function terminalInfoOfGate(
  position: Position,
  options: GateComponentOptions
): TerminalInfo[] {
  const { type, numberOfInputs } = options;
  const geo = getGateGeometry(type, numberOfInputs);

  const result: TerminalInfo[] = [];

  // Input terminals
  for (let i = 0; i < numberOfInputs; i++) {
    result.push({
      name: `in${i}`,
      direction: "in",
      position: {
        x: position.x + geo.inputXPositions[i],
        y: position.y + geo.inputYPositions[i],
      },
    });
  }

  // Output terminal
  result.push({
    name: "out",
    direction: "out",
    position: {
      x: position.x + geo.outputX,
      y: position.y,
    },
  });

  return result;
}
