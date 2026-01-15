import type { NotComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

interface NotRendererProps {
  x: number;
  y: number;
  options: NotComponentOptions;
}

const NOT_TRIANGLE_WIDTH = 40;
const NOT_TRIANGLE_HEIGHT = 30;
const BUBBLE_RADIUS = 5;

// Shared coordinate calculations (center-origin)
function getNotGeometry() {
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

export function NotRenderer({ x, y }: NotRendererProps) {
  const geo = getNotGeometry();

  // Triangle path in center-origin coordinates
  const trianglePath = `M ${geo.triangleLeftX} ${geo.triangleTopY} L ${geo.triangleRightX} 0 L ${geo.triangleLeftX} ${geo.triangleBottomY} Z`;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Triangle body */}
      <path
        d={trianglePath}
        fill="transparent"
        stroke="white"
        strokeWidth="2"
      />

      {/* Inversion bubble */}
      <circle
        cx={geo.bubbleX}
        cy={0}
        r={BUBBLE_RADIUS}
        fill="none"
        stroke="white"
        strokeWidth="2"
      />

      {/* Label */}
      <text
        x={geo.triangleLeftX + NOT_TRIANGLE_WIDTH / 3}
        y={0}
        fill="white"
        fontSize="10"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
      >
        NOT
      </text>
    </g>
  );
}

export default function terminalInfoOfNot(
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
