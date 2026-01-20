import type { GateComponentOptions, GateType } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

export const GATE_WIDTH = 60;
const INPUT_SPACING = 15;
const GATE_VERTICAL_PADDING = 16;

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
  const bodyHeight = numberOfInputs * INPUT_SPACING + GATE_VERTICAL_PADDING;
  const halfW = GATE_WIDTH / 2;
  const halfH = bodyHeight / 2;

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

  const xorOffset = hasXorCurve(type) ? XOR_CURVE_OFFSET : 0;
  const bubbleOffset = hasInversionBubble(type) ? BUBBLE_RADIUS * 2 : 0;

  const curveStartX = halfW - CURVE_PROPORTION * GATE_WIDTH;

  return {
    // Gate body measurements (excluding XOR curve and bubble)
    bodyWidth: GATE_WIDTH,
    bodyHeight,
    bodyLeftX: -halfW,
    bodyRightX: halfW,
    bodyTopY: -halfH,
    bodyBottomY: halfH,

    // Full component bounding box (includes all visual parts)
    leftX: -halfW - xorOffset,
    rightX: halfW + bubbleOffset,
    topY: -halfH,
    bottomY: halfH,
    width: GATE_WIDTH + xorOffset + bubbleOffset,
    height: bodyHeight,

    // Center coordinates (for relative positioning)
    centerX: 0,
    centerY: 0,

    bubbleCenterX: halfW + BUBBLE_RADIUS,
    bubbleCenterY: 0,

    inputYPositions,
    inputXPositions,
    curveStartX,
  };
}

export function terminalInfoOfGate(
  position: Position,
  options: GateComponentOptions,
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
      x: position.x + geo.rightX,
      y: position.y + geo.centerY,
    },
  });

  return result;
}

/**
 * Simulate a gate component.
 * @param options The gate component options
 * @param inputs Map of input terminal names to values ("in0", "in1", ...)
 * @returns Map of output terminal name to value
 */
export function simulateGate(
  options: GateComponentOptions,
  inputs: Map<string, bigint>,
): Map<string, bigint> {
  const { type, numberOfInputs, bitWidth } = options;
  const mask = (1n << BigInt(bitWidth)) - 1n;

  // Collect input values
  const inputValues: bigint[] = [];
  for (let i = 0; i < numberOfInputs; i++) {
    inputValues.push(inputs.get(`in${i}`) ?? 0n);
  }

  let result: bigint;

  switch (type) {
    case "AND":
      result = inputValues.reduce((acc, val) => acc & val, mask);
      break;
    case "OR":
      result = inputValues.reduce((acc, val) => acc | val, 0n);
      break;
    case "NAND":
      result = ~inputValues.reduce((acc, val) => acc & val, mask) & mask;
      break;
    case "NOR":
      result = ~inputValues.reduce((acc, val) => acc | val, 0n) & mask;
      break;
    case "XOR":
      result = inputValues.reduce((acc, val) => acc ^ val, 0n);
      break;
    case "XNOR":
      result = ~inputValues.reduce((acc, val) => acc ^ val, 0n) & mask;
      break;
  }

  const outputs = new Map<string, bigint>();
  outputs.set("out", result & mask);
  return outputs;
}
