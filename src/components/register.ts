import type { RegisterComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

const REGISTER_WIDTH_SINGLE_BIT = 50;
const REGISTER_WIDTH_MULTIBIT = 80;
const REGISTER_HEIGHT = 40;

// Clock triangle dimensions
const CLOCK_TRIANGLE_HALF_WIDTH = 5;
const CLOCK_TRIANGLE_HEIGHT = 8;

// Shared coordinate calculations (center-origin)
export function getRegisterGeometry(bitWidth: number) {
  const multiBit = bitWidth > 1;
  const width = multiBit ? REGISTER_WIDTH_MULTIBIT : REGISTER_WIDTH_SINGLE_BIT;
  const halfW = width / 2;
  const halfH = REGISTER_HEIGHT / 2;

  return {
    multiBit,
    bitWidth,
    // Standard geometry
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
    width,
    height: REGISTER_HEIGHT,
    centerX: 0,
    centerY: 0,
    // Clock triangle dimensions
    clockTriangleHalfWidth: CLOCK_TRIANGLE_HALF_WIDTH,
    clockTriangleHeight: CLOCK_TRIANGLE_HEIGHT,
  };
}

export function terminalInfoOfRegister(
  position: Position,
  options: RegisterComponentOptions,
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

/**
 * Simulate a register component (returns current stored value).
 * @param options The register component options
 * @param state Current stored value
 * @returns Map of output terminal name to value
 */
export function simulateRegister(
  options: RegisterComponentOptions,
  state: bigint,
): Map<string, bigint> {
  const mask = (1n << BigInt(options.bitWidth)) - 1n;
  const outputs = new Map<string, bigint>();
  outputs.set("q", state & mask);
  return outputs;
}

/**
 * Update register state on clock edge.
 * @param options The register component options
 * @param inputs Map of input terminal names to values ("d")
 * @param _state Current stored value (unused, kept for consistency)
 * @returns New state value
 */
export function updateRegisterOnClockEdge(
  options: RegisterComponentOptions,
  inputs: Map<string, bigint>,
  _state: bigint,
): bigint {
  const mask = (1n << BigInt(options.bitWidth)) - 1n;
  const d = inputs.get("d") ?? 0n;
  return d & mask;
}
