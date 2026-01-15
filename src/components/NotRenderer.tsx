import type { NotComponentOptions } from "../types/LogicComponent";
import { BUBBLE_RADIUS } from "./gate";
import { getNotGeometry, NOT_TRIANGLE_WIDTH } from "./not";

interface NotRendererProps {
  x: number;
  y: number;
  options: NotComponentOptions;
}

export default function NotRenderer({ x, y }: NotRendererProps) {
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
