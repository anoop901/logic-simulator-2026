import type { SwitchComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

// Dimensions for switch component
export const SWITCH_WIDTH = 60;
export const SWITCH_HEIGHT = 30;
const HANDLE_RADIUS = 8;

export function getSwitchGeometry() {
  const width = SWITCH_WIDTH;
  const height = SWITCH_HEIGHT;
  const halfW = width / 2;
  const halfH = height / 2;

  const centerX = 0;
  const centerY = 0;

  const handleOffX = -halfW + 15;
  const handleOnX = -halfW + 30;

  const handleSpaceLeft = handleOffX - HANDLE_RADIUS;
  const handleSpaceRight = handleOnX + HANDLE_RADIUS;
  const handleSpaceTop = centerX - HANDLE_RADIUS;
  const handleSpaceBottom = centerY + HANDLE_RADIUS;

  const labelX = (handleSpaceRight + halfW) / 2;

  return {
    width,
    height,

    handleOffX,
    handleOnX,
    handleRadius: HANDLE_RADIUS,
    handleSpaceLeft,
    handleSpaceRight,
    handleSpaceTop,
    handleSpaceBottom,
    handleSpaceWidth: handleOnX - handleOffX + 2 * HANDLE_RADIUS,
    handleSpaceHeight: 2 * HANDLE_RADIUS,
    labelX,

    // Standard geometry
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
    centerX: 0,
    centerY: 0,
  };
}

export function terminalInfoOfSwitch(position: Position): TerminalInfo[] {
  const geo = getSwitchGeometry();
  return [
    {
      name: "out",
      direction: "out",
      position: {
        x: position.x + geo.rightX,
        y: position.y + geo.centerY,
      },
    },
  ];
}

/**
 * Simulate a switch component.
 * @param options The switch component options
 * @returns Map of output terminal name to value
 */
export function simulateSwitch(
  options: SwitchComponentOptions,
): Map<string, bigint> {
  const outputs = new Map<string, bigint>();
  outputs.set("out", options.isOn ? 1n : 0n);
  return outputs;
}
