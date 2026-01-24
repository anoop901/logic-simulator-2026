import type { LEDComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

// Dimensions for LED component
export const LED_RADIUS = 12;
export const LED_WIDTH = LED_RADIUS * 2;
export const LED_HEIGHT = LED_RADIUS * 2;

export function getLEDGeometry() {
  const radius = LED_RADIUS;

  return {
    width: LED_WIDTH,
    height: LED_HEIGHT,
    radius,

    // Standard geometry (component is centered at origin)
    leftX: -radius,
    rightX: radius,
    topY: -radius,
    bottomY: radius,
    centerX: 0,
    centerY: 0,
  };
}

export function terminalInfoOfLED(position: Position): TerminalInfo[] {
  const geo = getLEDGeometry();
  return [
    {
      name: "in",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.centerY,
      },
    },
  ];
}

/**
 * Simulate an LED component.
 * LED is an output-only component, so it has no output terminals.
 * The input value is used for display purposes only.
 * @param _options The LED component options (unused)
 * @param _inputs Map of input terminal name to value (unused for outputs)
 * @returns Empty map (LED has no outputs)
 */
export function simulateLED(
  _options: LEDComponentOptions,
  _inputs: Map<string, bigint>,
): Map<string, bigint> {
  // LED has no outputs - it's a display-only component
  return new Map<string, bigint>();
}
