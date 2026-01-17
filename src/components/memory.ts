import type { MemoryComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

export const MEMORY_WIDTH = 80;
export const MEMORY_HEIGHT = 70;

// Shared coordinate calculations (center-origin)
export function getMemoryGeometry() {
  const halfW = MEMORY_WIDTH / 2;
  const halfH = MEMORY_HEIGHT / 2;

  // Input Y positions relative to center
  const addrY = -halfH + 20;
  const dataY = 0;
  const weY = halfH - 15;

  return {
    halfW,
    halfH,
    addrY,
    dataY,
    weY,
    // Key positions
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
  };
}

export function terminalInfoOfMemory(
  position: Position,
  options: MemoryComponentOptions
): TerminalInfo[] {
  const { type } = options;
  const geo = getMemoryGeometry();

  const result: TerminalInfo[] = [
    // Address input (top-left)
    {
      name: "addr",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.addrY,
      },
    },
  ];

  if (type === "RAM") {
    // Data input (left, center)
    result.push({
      name: "data",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.dataY,
      },
    });
    // Write enable (left, bottom)
    result.push({
      name: "we",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.weY,
      },
    });
  }

  // Output (right, center)
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

/**
 * Simulate a memory component (returns value at address).
 * @param options The memory component options
 * @param inputs Map of input terminal names to values ("addr")
 * @param state Memory contents as Uint8Array
 * @returns Map of output terminal name to value
 */
export function simulateMemory(
  options: MemoryComponentOptions,
  inputs: Map<string, bigint>,
  state: Uint8Array
): Map<string, bigint> {
  const { wordSize } = options;

  const addr = inputs.get("addr") ?? 0n;
  const byteAddr = Number(addr) * wordSize;

  // Read wordSize bytes from state
  let value = 0n;
  for (let i = 0; i < wordSize && byteAddr + i < state.length; i++) {
    value |= BigInt(state[byteAddr + i]) << BigInt(i * 8);
  }

  const outputs = new Map<string, bigint>();
  outputs.set("out", value);
  return outputs;
}

/**
 * Update RAM state on clock edge if write-enabled.
 * @param options The memory component options
 * @param inputs Map of input terminal names to values ("addr", "data", "we")
 * @param state Memory contents as Uint8Array
 * @returns New state (or same if ROM or we=0)
 */
export function updateMemoryOnClockEdge(
  options: MemoryComponentOptions,
  inputs: Map<string, bigint>,
  state: Uint8Array
): Uint8Array {
  const { type, wordSize } = options;

  // ROM cannot be written
  if (type === "ROM") {
    return state;
  }

  const we = inputs.get("we") ?? 0n;
  if (we === 0n) {
    return state;
  }

  const addr = inputs.get("addr") ?? 0n;
  const data = inputs.get("data") ?? 0n;
  const byteAddr = Number(addr) * wordSize;

  // Clone state before modifying
  const newState = new Uint8Array(state);

  // Write wordSize bytes to state
  for (let i = 0; i < wordSize && byteAddr + i < newState.length; i++) {
    newState[byteAddr + i] = Number((data >> BigInt(i * 8)) & 0xffn);
  }

  return newState;
}
