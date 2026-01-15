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
