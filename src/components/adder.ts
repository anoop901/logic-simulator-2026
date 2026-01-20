import type { AdderComponentOptions } from "../types/LogicComponent";
import type Position from "../types/Position";
import type { TerminalInfo } from "./terminalInfoOfComponent";

const ADDER_WIDTH = 40;
const ADDER_HEIGHT = 100;
export const NOTCH_DEPTH = 10;
export const TRAPEZOID_INSET = 20;

// Shared coordinate calculations (center-origin)
export function getAdderGeometry() {
  const halfW = ADDER_WIDTH / 2;
  const halfH = ADDER_HEIGHT / 2;

  // Input A and B Y positions relative to center
  const inputAY = -halfH + (ADDER_HEIGHT - NOTCH_DEPTH * 2) / 4;
  const inputBY = halfH - (ADDER_HEIGHT - NOTCH_DEPTH * 2) / 4;

  return {
    inputAY,
    inputBY,
    // Standard geometry
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
    width: ADDER_WIDTH,
    height: ADDER_HEIGHT,
    centerX: 0,
    centerY: 0,
  };
}

export function terminalInfoOfAdder(
  position: Position,
  _options: AdderComponentOptions,
): TerminalInfo[] {
  const geo = getAdderGeometry();

  return [
    // Input A (top-left)
    {
      name: "a",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.inputAY,
      },
    },
    // Input B (bottom-left)
    {
      name: "b",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.inputBY,
      },
    },
    // Carry in (top)
    {
      name: "cin",
      direction: "in",
      position: {
        x: position.x,
        y: position.y + geo.topY + TRAPEZOID_INSET / 2,
      },
    },
    // Sum output (right)
    {
      name: "sum",
      direction: "out",
      position: {
        x: position.x + geo.rightX,
        y: position.y,
      },
    },
    // Carry out (bottom)
    {
      name: "cout",
      direction: "out",
      position: {
        x: position.x,
        y: position.y + geo.bottomY - TRAPEZOID_INSET / 2,
      },
    },
  ];
}

/**
 * Simulate an adder component.
 * @param options The adder component options
 * @param inputs Map of input terminal names to values ("a", "b", "cin")
 * @returns Map of output terminal names to values ("sum", "cout")
 */
export function simulateAdder(
  options: AdderComponentOptions,
  inputs: Map<string, bigint>,
): Map<string, bigint> {
  const { bitWidth } = options;
  const mask = (1n << BigInt(bitWidth)) - 1n;

  const a = inputs.get("a") ?? 0n;
  const b = inputs.get("b") ?? 0n;
  const cin = inputs.get("cin") ?? 0n;

  const total = a + b + (cin & 1n);
  const sum = total & mask;
  const cout = (total >> BigInt(bitWidth)) & 1n;

  const outputs = new Map<string, bigint>();
  outputs.set("sum", sum);
  outputs.set("cout", cout);
  return outputs;
}
